"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
  Image,
  Modal,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useSession } from "context/SessionContext"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Reanimated, { FadeIn, FadeInDown } from "react-native-reanimated"
import * as ImagePicker from "expo-image-picker"
import Toast from "react-native-toast-message"

const { width: screenWidth } = Dimensions.get("window")

// Unified Color Palette
const COLORS = {
  primary: "#FF6B6B",
  primaryDark: "#FF5252",
  inactive: "#94A3B8",
  inactiveLight: "#CBD5E1",
  background: "#ffffff",
  accent: "#F1F5F9",
  shadow: "#000000",
  success: "#10b981",
  warning: "#F59E0B",
  error: "#EF4444",
  gradient: ["#FF6B6B", "#FF5252"],
  gradientLight: ["#FFF5F5", "#FFE5E5"],
}

const ProfileScreen = () => {
  const { user } = useSession()
  const [formSections, setFormSections] = useState([])
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const [verificationStatus, setVerificationStatus] = useState("Unverified")
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedField, setSelectedField] = useState(null)
  const [photos, setPhotos] = useState([
    { id: 1, url: null, isPrimary: true },
    { id: 2, url: null, isPrimary: false },
    { id: 3, url: null, isPrimary: false },
    { id: 4, url: null, isPrimary: false },
  ])
  const [fieldErrors, setFieldErrors] = useState({})
  const scrollViewRef = useRef(null)

  const fieldNameMappings = {
    "Full Name": "name",
    "Height": "height",
    "Weight": "weight",
    "Date of Birth": "dob",
    "Marital Status": "maritalStatus",
    "Mother Tongue": "motherTongue",
    "Current City": "currentCity",
    "Email Address": "email",
    "Permanent Address": "permanentAddress",
    "Gender": "gender",
    "Blood Group": "bloodGroup",
    "Complexion": "complexion",
    "Highest Education": "education",
    "Occupation": "occupation",
    "Field of Study": "fieldOfStudy",
    "Company": "company",
    "College/University": "college",
    "Annual Income": "income",
    "Father's Name": "fatherName",
    "Mother's Name": "mother",
    "Religion": "religion",
    "Sub Caste": "subCaste",
    "Caste": "caste",
    "Gothra": "gothra",
  }

  const normalizeFieldName = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "")
  }

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        Alert.alert("Error", "User not authenticated")
        setIsLoading(false)
        return
      }

      try {
        const sectionsRes = await fetch("https://shiv-bandhan-testing.vercel.app/api/admin/form-sections")
        if (!sectionsRes.ok) throw new Error("Failed to fetch form sections")
        const sectionsData = await sectionsRes.json()

        const transformedSections = sectionsData.map((section) => ({
          ...section,
          id: section._id,
          fields: section.fields.map((field) => ({
            ...field,
            name: field.name,
            label: field.label,
            type: field.type,
            required: field.required,
            options: field.options || [],
            placeholder: field.placeholder || "",
          })),
        }))

        setFormSections(transformedSections)

        const userRes = await fetch(`https://shiv-bandhan-testing.vercel.app/api/users/${user.id}`)
        if (!userRes.ok) throw new Error("Failed to fetch user data")
        const userData = await userRes.json()

        const initialFormData = {}
        transformedSections.forEach((section) => {
          section.fields.forEach((field) => {
            const mappingEntry = Object.entries(fieldNameMappings).find(
              ([key]) => normalizeFieldName(key) === normalizeFieldName(field.name),
            )
            if (mappingEntry) {
              const [_, backendField] = mappingEntry
              if (userData[backendField] !== undefined) {
                initialFormData[field.name] = userData[backendField]
              }
            }
          })
        })

        setFormData(initialFormData)
        
        if (userData.profilePhoto) {
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) => (photo.id === 1 ? { ...photo, url: userData.profilePhoto } : photo)),
          )
        }

        if (userData.verificationStatus) {
          setVerificationStatus(userData.verificationStatus)
        }

      } catch (error) {
        console.error("Error loading data:", error)
        Alert.alert("Error", `Failed to load profile: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [user])

  useEffect(() => {
    if (Object.keys(formData).length > 0 && formSections.length > 0) {
      setProfileCompletion(calculateProfileCompletion())
    }
  }, [formData, formSections])

  const calculateProfileCompletion = () => {
    if (!formSections.length) return 0

    const requiredFields = Object.keys(fieldNameMappings)
    let totalFields = requiredFields.length
    let filledFields = 0

    requiredFields.forEach((fieldName) => {
      const value = formData[fieldName]
      if (value !== undefined && value !== null && value !== "") {
        filledFields++
      }
    })

    totalFields++
    if (formData.profilePhoto || (photos[0] && photos[0].url)) {
      filledFields++
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
  }

  const validateField = (field, value) => {
    if (field.required && (value === undefined || value === "" || value === null)) {
      return `${field.label} is required`
    }
    return ""
  }

  const handleInputChange = (fieldName, value, field) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    if (field) {
      const error = validateField(field, value)
      setFieldErrors((prev) => ({ ...prev, [fieldName]: error }))
    }
    setShowDropdown(false)
  }

  const handleProfileUpdate = async () => {
    setIsSaving(true)
    try {
      const errors = {}
      formSections.forEach((section) => {
        section.fields.forEach((field) => {
          const error = validateField(field, formData[field.name])
          if (error) errors[field.name] = error
        })
      })

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors)
        Toast.show({
          type: "error",
          text1: "Missing Fields",
          text2: "Please fill all required fields",
          position: "bottom",
        })
        setIsSaving(false)
        return
      }

      const transformedData = {}
      Object.entries(fieldNameMappings).forEach(([displayName, backendField]) => {
        if (formData[displayName] !== undefined) {
          transformedData[backendField] = formData[displayName]
        }
      })

      const payload = {
        ...transformedData,
        userId: user?.id,
        profilePhoto: photos[0]?.url,
      }

      const response = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been saved successfully",
        position: "bottom",
      })

    } catch (error) {
      console.error("Error updating profile:", error)
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message,
        position: "bottom",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = async (photoId) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Please allow access to your photo library")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        const formDataUpload = new FormData()
        formDataUpload.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `photo-${photoId}.jpg`,
        })
        formDataUpload.append("upload_preset", "shivbandhan")

        const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dqfum2awz/image/upload", {
          method: "POST",
          body: formDataUpload,
        })

        const uploadResult = await uploadResponse.json()
        if (uploadResult.secure_url) {
          setPhotos((prev) =>
            prev.map((photo) => (photo.id === photoId ? { ...photo, url: uploadResult.secure_url } : photo)),
          )
          if (photoId === 1) {
            handleInputChange("profilePhoto", uploadResult.secure_url)
          }
        }
      }
    } catch (error) {
      console.error("Error uploading photo:", error)
      Alert.alert("Error", "Failed to upload photo")
    }
  }

  const handleDeletePhoto = (photoId) => {
    setPhotos((prevPhotos) => prevPhotos.map((photo) => (photo.id === photoId ? { ...photo, url: null } : photo)))
    if (photoId === 1) {
      handleInputChange("profilePhoto", null)
    }
  }

  const handleNextSection = () => {
    if (currentSectionIndex < formSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1)
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }
  }

  // Verification Badge Component
  const VerificationBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status?.toLowerCase()) {
        case "verified":
          return {
            icon: "checkmark-circle",
            iconColor: COLORS.success,
            text: "Verified",
            bgColor: "rgba(16, 185, 129, 0.1)",
          }
        case "pending":
          return {
            icon: "time-outline",
            iconColor: COLORS.warning,
            text: "Pending",
            bgColor: "rgba(245, 158, 11, 0.1)",
          }
        default:
          return {
            icon: "shield-outline",
            iconColor: COLORS.primary,
            text: "Unverified",
            bgColor: "rgba(255, 107, 107, 0.1)",
          }
      }
    }

    const config = getStatusConfig()

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: config.bgColor,
        alignSelf: 'flex-start',
        marginTop: 6
      }}>
        <Ionicons name={config.icon} size={12} color={config.iconColor} />
        <Text style={{
          marginLeft: 4,
          fontSize: 11,
          fontWeight: '600',
          color: config.iconColor
        }}>{config.text}</Text>
      </View>
    )
  }

  // Section Modal Component
  const SectionModal = () => (
    <Modal
      visible={showSectionModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSectionModal(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        <Reanimated.View
          entering={FadeInDown.duration(300).springify()}
          style={{
            backgroundColor: COLORS.background,
            borderRadius: 24,
            width: '100%',
            maxHeight: '70%',
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.accent
          }}>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>Profile Sections</Text>
            <TouchableOpacity
              onPress={() => setShowSectionModal(false)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: COLORS.accent,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Ionicons name="close" size={18} color={COLORS.inactive} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
            {formSections.map((section, index) => (
              <TouchableOpacity
                key={section._id}
                onPress={() => {
                  setCurrentSectionIndex(index)
                  setShowSectionModal(false)
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true })
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderRadius: 16,
                  marginBottom: 12,
                  backgroundColor: currentSectionIndex === index ? `${COLORS.primary}15` : COLORS.accent,
                  borderWidth: 2,
                  borderColor: currentSectionIndex === index ? COLORS.primary : 'transparent'
                }}
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: currentSectionIndex === index ? COLORS.primary : COLORS.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14
                }}>
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color={currentSectionIndex === index ? COLORS.background : COLORS.inactive}
                  />
                </View>
                <Text style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: currentSectionIndex === index ? '700' : '600',
                  color: currentSectionIndex === index ? COLORS.primary : '#374151'
                }}>{section.label}</Text>
                {currentSectionIndex === index && (
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Reanimated.View>
      </View>
    </Modal>
  )

  // Input Field Component
  const renderInputField = (field, value, onChangeText, error) => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#374151',
          marginBottom: 10
        }}>
          {field.label}
          {field.required && <Text style={{ color: COLORS.error }}> *</Text>}
        </Text>

        {field.type === "textarea" ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: COLORS.background,
              borderWidth: 2,
              borderColor: error ? COLORS.error : COLORS.accent,
              borderRadius: 16,
              padding: 14,
              fontSize: 15,
              color: '#111827',
              minHeight: 100,
              textAlignVertical: 'top'
            }}
            placeholderTextColor={COLORS.inactive}
          />
        ) : field.type === "select" ? (
          <TouchableOpacity
            onPress={() => {
              setSelectedField(field._id)
              setShowDropdown(!showDropdown)
            }}
            style={{
              backgroundColor: COLORS.background,
              borderWidth: 2,
              borderColor: error ? COLORS.error : COLORS.accent,
              borderRadius: 16,
              padding: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text style={{ fontSize: 15, color: value ? '#111827' : COLORS.inactive }}>
              {value || field.placeholder}
            </Text>
            <Ionicons name="chevron-down" size={18} color={COLORS.inactive} />
          </TouchableOpacity>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            style={{
              backgroundColor: COLORS.background,
              borderWidth: 2,
              borderColor: error ? COLORS.error : COLORS.accent,
              borderRadius: 16,
              padding: 14,
              fontSize: 15,
              color: '#111827'
            }}
            placeholderTextColor={COLORS.inactive}
          />
        )}

        {error && <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 6, marginLeft: 4 }}>{error}</Text>}

        {showDropdown && selectedField === field._id && (
          <View style={{
            backgroundColor: COLORS.background,
            borderWidth: 2,
            borderColor: COLORS.accent,
            borderRadius: 16,
            marginTop: 8,
            maxHeight: 200,
            shadowColor: COLORS.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4
          }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {field.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onChangeText(option)
                    setShowDropdown(false)
                    setSelectedField(null)
                  }}
                  style={{
                    padding: 14,
                    borderBottomWidth: index < field.options.length - 1 ? 1 : 0,
                    borderBottomColor: COLORS.accent,
                    backgroundColor: value === option ? `${COLORS.primary}10` : 'transparent'
                  }}
                >
                  <Text style={{
                    fontSize: 15,
                    color: value === option ? COLORS.primary : '#374151',
                    fontWeight: value === option ? '600' : '400'
                  }}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    )
  }

  // Photo Grid Component
  const renderPhotoGrid = () => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 }}>Profile Photos</Text>
      
      <View style={{
        backgroundColor: `${COLORS.warning}15`,
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'flex-start'
      }}>
        <Ionicons name="information-circle-outline" size={18} color={COLORS.warning} style={{ marginTop: 2 }} />
        <Text style={{
          marginLeft: 10,
          flex: 1,
          fontSize: 12,
          color: '#92400E',
          lineHeight: 18
        }}>Upload clear, recent photos. First photo will be your main profile picture.</Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {photos.map((photo) => {
          const isPrimary = photo.id === 1

          return (
            <View key={photo.id} style={{ width: '48%', marginBottom: 14 }}>
              <TouchableOpacity
                onPress={() => handlePhotoUpload(photo.id)}
                style={{
                  aspectRatio: 1,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderStyle: 'dashed',
                  borderColor: photo.url ? COLORS.primary : COLORS.inactiveLight,
                  backgroundColor: photo.url ? 'transparent' : COLORS.accent,
                  overflow: 'hidden'
                }}
              >
                {photo.url ? (
                  <>
                    <Image source={{ uri: photo.url }} style={{ width: '100%', height: '100%' }} />
                    {isPrimary && (
                      <View style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        backgroundColor: COLORS.primary,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8
                      }}>
                        <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: '700' }}>MAIN</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="camera-outline" size={28} color={COLORS.inactive} />
                    <Text style={{ color: COLORS.inactive, fontSize: 11, marginTop: 8, fontWeight: '500' }}>
                      {isPrimary ? "Main Photo" : `Photo ${photo.id}`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {photo.url && (
                <TouchableOpacity
                  onPress={() => handleDeletePhoto(photo.id)}
                  style={{
                    marginTop: 8,
                    backgroundColor: `${COLORS.error}15`,
                    paddingVertical: 8,
                    borderRadius: 12,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ color: COLORS.error, fontSize: 12, fontWeight: '600' }}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )

  // Current Section Content
  const renderCurrentSection = () => {
    const section = formSections[currentSectionIndex]
    if (!section) return null

    return (
      <Reanimated.View entering={FadeIn.delay(200)} style={{ marginBottom: 20 }}>
        <View style={{
          backgroundColor: COLORS.background,
          borderRadius: 24,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
          borderWidth: 1,
          borderColor: COLORS.accent,
          overflow: 'hidden'
        }}>
          <View style={{
            padding: 20,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.accent,
            backgroundColor: COLORS.background
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: `${COLORS.primary}15`,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14
              }}>
                <Ionicons name="document-text" size={22} color={COLORS.primary} />
              </View>
              <Text style={{
                flex: 1,
                fontSize: 18,
                fontWeight: '700',
                color: '#111827'
              }}>{section.label}</Text>
            </View>
          </View>

          <View style={{ padding: 20 }}>
            {section.fields?.map((field) => {
              if (field.type === "photos") {
                return <View key={field._id}>{renderPhotoGrid()}</View>
              }
              const value = formData?.[field.name] || ""
              const errorMsg = fieldErrors?.[field.name]
              return (
                <View key={field._id}>
                  {renderInputField(field, value, (text) => handleInputChange(field.name, text, field), errorMsg)}
                </View>
              )
            })}
          </View>
        </View>
      </Reanimated.View>
    )
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.accent }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, fontSize: 15, color: COLORS.inactive, fontWeight: '500' }}>
          Loading your profile...
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.accent }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Header (Now Scrollable) */}
          <LinearGradient
            colors={COLORS.gradient}
            style={{
              paddingHorizontal: 24,
              paddingTop: 16,
              paddingBottom: 24,
              borderBottomLeftRadius: 28,
              borderBottomRightRadius: 28
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity
                onPress={() => handlePhotoUpload(1)}
                style={{ position: 'relative', marginRight: 16 }}
              >
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  overflow: 'hidden',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }}>
                  {formData?.profilePhoto ? (
                    <Image source={{ uri: formData.profilePhoto }} style={{ width: '100%', height: '100%' }} />
                  ) : (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="person-outline" size={32} color={COLORS.background} />
                    </View>
                  )}
                </View>
                <View style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 28,
                  height: 28,
                  backgroundColor: COLORS.background,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: COLORS.primary
                }}>
                  <Ionicons name="camera" size={14} color={COLORS.primary} />
                </View>
              </TouchableOpacity>

              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: COLORS.background,
                  marginBottom: 4
                }}>
                  {formData?.name || "Your Name"}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  {formData?.height && (
                    <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '500' }}>
                      {formData.height}
                    </Text>
                  )}
                  {formData?.religion && (
                    <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', marginLeft: 8, fontWeight: '500' }}>
                      • {formData.religion}
                    </Text>
                  )}
                </View>
                {formData?.currentCity && (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="location-outline" size={13} color="rgba(255, 255, 255, 0.9)" />
                    <Text style={{ fontSize: 13, color: 'rgba(255, 255, 255, 0.9)', marginLeft: 4, fontWeight: '500' }}>
                      {formData.currentCity}
                    </Text>
                  </View>
                )}
                <VerificationBadge status={verificationStatus} />
              </View>
            </View>

            {/* Profile Completion Card */}
            <View style={{
              backgroundColor: COLORS.background,
              borderRadius: 20,
              padding: 18,
              shadowColor: COLORS.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>Profile Completion</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.primary }}>{profileCompletion}%</Text>
              </View>

              <View style={{
                width: '100%',
                backgroundColor: COLORS.accent,
                borderRadius: 8,
                height: 10,
                marginBottom: 14,
                overflow: 'hidden'
              }}>
                <View style={{
                  height: '100%',
                  backgroundColor: COLORS.primary,
                  width: `${profileCompletion}%`,
                  borderRadius: 8
                }} />
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                <TouchableOpacity
                  onPress={() => setShowSectionModal(true)}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.accent,
                    paddingVertical: 12,
                    borderRadius: 14
                  }}
                >
                  <Ionicons name="grid-outline" size={16} color={COLORS.inactive} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.inactive, marginLeft: 6 }}>
                    Sections
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleProfileUpdate}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: COLORS.primary,
                    paddingVertical: 12,
                    borderRadius: 14,
                    opacity: isSaving ? 0.7 : 1
                  }}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={COLORS.background} />
                  ) : (
                    <>
                      <Ionicons name="save-outline" size={16} color={COLORS.background} />
                      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.background, marginLeft: 6 }}>
                        Save
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>

          {/* Content Area */}
          <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
            {/* Section Navigation */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}>
              <TouchableOpacity
                onPress={handlePreviousSection}
                disabled={currentSectionIndex === 0}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: currentSectionIndex === 0 ? COLORS.accent : COLORS.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: COLORS.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2
                }}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={currentSectionIndex === 0 ? COLORS.inactive : COLORS.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowSectionModal(true)}
                style={{ flex: 1, marginHorizontal: 16 }}
              >
                <Text style={{
                  fontSize: 17,
                  fontWeight: '700',
                  color: '#111827',
                  textAlign: 'center'
                }} numberOfLines={1}>
                  {formSections[currentSectionIndex]?.label}
                </Text>
                <Text style={{ fontSize: 13, color: COLORS.inactive, textAlign: 'center', marginTop: 2, fontWeight: '500' }}>
                  {currentSectionIndex + 1} of {formSections.length}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNextSection}
                disabled={currentSectionIndex === formSections.length - 1}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: currentSectionIndex === formSections.length - 1 ? COLORS.accent : COLORS.background,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: COLORS.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 4,
                  elevation: 2
                }}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={currentSectionIndex === formSections.length - 1 ? COLORS.inactive : COLORS.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Current Section */}
            {renderCurrentSection()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Section Modal */}
      <SectionModal />

      {/* Toast Notification */}
      <Toast />
    </SafeAreaView>
  )
}

export default ProfileScreen
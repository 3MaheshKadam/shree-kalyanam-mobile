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
} from "react-native"
import { useSession } from "context/SessionContext"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Reanimated, { FadeIn, FadeInDown } from "react-native-reanimated"
import * as ImagePicker from "expo-image-picker"
import Toast from "react-native-toast-message"

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

// Enhanced modern color palette with better contrast and accessibility
const COLORS = {
  primary: "#E91E63",
  primaryLight: "#F8BBD0",
  primaryDark: "#AD1457",
  secondary: "#FF4081",
  accent: "#FF1744",
  success: "#00C853",
  warning: "#FF8F00",
  error: "#D32F2F",
  background: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",
  outline: "#E0E0E0",
  onSurface: "#212121",
  onSurfaceVariant: "#757575",
  onSurfaceMuted: "#9E9E9E",
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.15)",
}

const ProfileScreen = () => {
  const { user } = useSession()
  const [formSections, setFormSections] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState({})
  const [adminWillFill, setAdminWillFill] = useState(false)
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
  const [expandedSections, setExpandedSections] = useState({})
  const flatListRef = useRef(null)

  const fieldNameMappings = {
    "Full Name": "name",
    Height: "height",
    Weight: "weight",
    "Date of Birth": "dob",
    "Marital Status": "maritalStatus",
    "Mother Tongue": "motherTongue",
    "Current City": "currentCity",
    "Email Address": "email",
    "Permanent Address": "permanentAddress",
    Gender: "gender",
    "Blood Group": "bloodGroup",
    "Wears Lens": "wearsLens",
    Complexion: "complexion",
    "Highest Education": "education",
    Occupation: "occupation",
    "Field of Study": "fieldOfStudy",
    Company: "company",
    "College/University": "college",
    "Annual Income": "income",
    "Father's Name": "fatherName",
    "Mother's Name": "mother",
    "Parent's Residence City": "parentResidenceCity",
    "Number of Brothers": "brothers",
    "Number of Sisters": "sisters",
    "Married Brothers": "marriedBrothers",
    "Married Sisters": "marriedSisters",
    "Native District": "nativeDistrict",
    "Native City": "nativeCity",
    "Family Wealth": "familyWealth",
    "Mama's Surname": "mamaSurname",
    "Parent's Occupation": "parentOccupation",
    "Relative Surnames": "relativeSurname",
    Religion: "religion",
    "Sub Caste": "subCaste",
    Caste: "caste",
    Gothra: "gothra",
    Rashi: "rashi",
    Nadi: "nadi",
    Nakshira: "nakshira",
    "Mangal Dosha": "mangal",
    Charan: "charan",
    "Birth Place": "birthPlace",
    "Birth Time": "birthTime",
    Gan: "gan",
    "Gotra Devak": "gotraDevak",
    "Expected Caste": "expectedCaste",
    "Preferred City": "preferredCity",
    "Expected Age Difference": "expectedAgeDifference",
    "Expected Education": "expectedEducation",
    "Accept Divorcee": "divorcee",
    "Expected Height": "expectedHeight",
    "Expected Income": "expectedIncome",
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
        if (transformedSections.length > 0) {
          setCurrentSectionIndex(0)
          const initialExpanded = {}
          transformedSections.forEach((section) => {
            initialExpanded[section._id] = true
          })
          setExpandedSections(initialExpanded)
        }

        const userRes = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/me")
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
            } else if (userData[field.name] !== undefined) {
              initialFormData[field.name] = userData[field.name]
            }
          })
        })

        Object.keys(userData).forEach((key) => {
          if (!initialFormData[key]) {
            initialFormData[key] = userData[key]
          }
        })

        setFormData(initialFormData)
        if (userData.profilePhoto) {
          setPhotos((prevPhotos) =>
            prevPhotos.map((photo) => (photo.id === 1 ? { ...photo, url: userData.profilePhoto } : photo)),
          )
        }

        if (userData.profileSetup?.willAdminFill !== undefined) {
          setAdminWillFill(userData.profileSetup.willAdminFill)
        }

        if (userData.verificationStatus) {
          setVerificationStatus(userData.verificationStatus)
        }

        setIsLoaded(true)
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

  const calculateProfileCompletion = (formDataToCheck = formData) => {
    if (!formSections.length) return 0

    const requiredFields = Object.keys(fieldNameMappings)
    let totalFields = requiredFields.length
    let filledFields = 0

    requiredFields.forEach((fieldName) => {
      const value = formDataToCheck[fieldName]
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          if (value.length > 0 && value.some((item) => item.trim() !== "")) {
            filledFields++
          }
        } else if (typeof value === "boolean") {
          filledFields++
        } else if (typeof value === "string" && value.trim() !== "") {
          filledFields++
        } else if (typeof value === "number") {
          filledFields++
        }
      }
    })

    totalFields++
    if (formDataToCheck.profilePhoto || (photos[0] && photos[0].url)) {
      filledFields++
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
  }

  const validateField = (field, value) => {
    if (
      field.required &&
      (value === undefined || value === "" || value === null || (Array.isArray(value) && value.length === 0))
    ) {
      return `${field.label} is required`
    }
    if (field.type === "date" && value) {
      const date = new Date(value)
      if (isNaN(date)) return "Invalid date format"
    }
    if (field.type === "number" && value && isNaN(value)) {
      return "Must be a valid number"
    }
    return ""
  }

  const handleInputChange = (fieldName, value, field) => {
    setFormData((prev) => {
      const newData = { ...prev, [fieldName]: value }
      setProfileCompletion(calculateProfileCompletion(newData))
      if (field) {
        const error = validateField(field, value)
        setFieldErrors((prev) => ({ ...prev, [fieldName]: error }))
      }
      return newData
    })
    setShowDropdown(false)
  }

  const handleMultiSelect = (fieldName, item, field) => {
    setFormData((prev) => {
      const current = prev[fieldName] || []
      const newValue = current.includes(item) ? current.filter((v) => v !== item) : [...current, item]
      const newData = { ...prev, [fieldName]: newValue }
      setProfileCompletion(calculateProfileCompletion(newData))
      if (field) {
        const error = validateField(field, newValue)
        setFieldErrors((prev) => ({ ...prev, [fieldName]: error }))
      }
      return newData
    })
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
        Alert.alert("Error", "Please fill all required fields correctly.")
        setIsSaving(false)
        return
      }

      const currentFormData = JSON.parse(JSON.stringify(formData))
      const transformedData = {
        name: currentFormData["Full Name"],
        email: currentFormData["Email Address"],
        gender: currentFormData["Gender"],
        dob: currentFormData["Date of Birth"],
        height: currentFormData["Height"],
        religion: currentFormData["Religion"],
        currentCity: currentFormData["Current City"],
        education: currentFormData["Highest Education"],
        maritalStatus: currentFormData["Marital Status"],
        motherTongue: currentFormData["Mother Tongue"],
        caste: currentFormData["Caste"],
        subCaste: currentFormData["Sub Caste"],
        gothra: currentFormData["Gothra"],
        fieldOfStudy: currentFormData["Field of Study"],
        college: currentFormData["College/University"],
        occupation: currentFormData["Occupation"],
        company: currentFormData["Company"],
        weight: currentFormData["Weight"],
        permanentAddress: currentFormData["Permanent Address"],
        profilePhoto: currentFormData["profilePhoto"],
        complexion: currentFormData["Complexion"],
        income: currentFormData["Annual Income"],
        bloodGroup: currentFormData["Blood Group"],
        wearsLens: currentFormData["Wears Lens"],
        fatherName: currentFormData["Father's Name"],
        parentResidenceCity: currentFormData["Parent's Residence City"],
        mother: currentFormData["Mother's Name"],
        brothers: currentFormData["Number of Brothers"],
        marriedBrothers: currentFormData["Married Brothers"],
        sisters: currentFormData["Number of Sisters"],
        marriedSisters: currentFormData["Married Sisters"],
        nativeDistrict: currentFormData["Native District"],
        nativeCity: currentFormData["Native City"],
        familyWealth: currentFormData["Family Wealth"],
        relativeSurname: currentFormData["Relative Surnames"] ? currentFormData["Relative Surnames"].join(", ") : "",
        parentOccupation: currentFormData["Parent's Occupation"],
        mamaSurname: currentFormData["Mama's Surname"],
        rashi: currentFormData["Rashi"],
        nakshira: currentFormData["Nakshira"],
        charan: currentFormData["Charan"],
        gan: currentFormData["Gan"],
        nadi: currentFormData["Nadi"],
        mangal: currentFormData["Mangal Dosha"],
        birthPlace: currentFormData["Birth Place"],
        birthTime: currentFormData["Birth Time"],
        gotraDevak: currentFormData["Gotra Devak"],
        expectedCaste: currentFormData["Expected Caste"],
        preferredCity: currentFormData["Preferred City"],
        expectedAgeDifference: currentFormData["Expected Age Difference"],
        expectedEducation: currentFormData["Expected Education"],
        divorcee: currentFormData["Accept Divorcee"],
        expectedHeight: currentFormData["Expected Height"],
        expectedIncome: currentFormData["Expected Income"],
      }

      const payload = {
        ...transformedData,
        userId: user?.id,
      }

      const response = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully!",
        position: "bottom",
      })

      if (profileCompletion === 100 && verificationStatus === "Unverified") {
        await handleVerificationSubmit()
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: `Failed to update profile: ${error.message}`,
        position: "bottom",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleVerificationSubmit = async () => {
    try {
      const response = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          verificationStatus: "Pending",
          verificationSubmittedAt: new Date(),
        }),
      })

      if (!response.ok) throw new Error("Failed to submit verification")
      setVerificationStatus("Pending")
      Toast.show({
        type: "success",
        text1: "Verification Submitted",
        text2: "Your profile has been submitted for verification!",
        position: "bottom",
      })
    } catch (error) {
      console.error("Error submitting verification:", error)
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: `Failed to submit verification: ${error.message}`,
        position: "bottom",
      })
    }
  }

  const handlePhotoUpload = async (photoId) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (!permission.granted) {
        Alert.alert("Permission Denied", "Please allow access to your photo library.")
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled) {
        const formData = new FormData()
        formData.append("file", {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `photo-${photoId}.jpg`,
        })
        formData.append("upload_preset", "shivbandhan")

        const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dqfum2awz/image/upload", {
          method: "POST",
          body: formData,
        })
//sample
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
      Alert.alert("Error", "Failed to upload photo.")
    }
  }

  const handleDeletePhoto = (photoId) => {
    setPhotos((prevPhotos) => prevPhotos.map((photo) => (photo.id === photoId ? { ...photo, url: null } : photo)))
    if (photoId === 1) {
      handleInputChange("profilePhoto", null)
    }
  }

  const handleMakePrimary = (photoId) => {
    setPhotos(
      photos.map((photo) => ({
        ...photo,
        isPrimary: photo.id === photoId,
      })),
    )
    const primaryPhoto = photos.find((photo) => photo.id === photoId)
    if (primaryPhoto.url) {
      handleInputChange("profilePhoto", primaryPhoto.url)
    }
  }

  const handleAdminFillToggle = async (enabled) => {
    setAdminWillFill(enabled)
    try {
      const response = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          profileSetup: {
            willAdminFill: enabled,
            dontAskAgain: formData.profileSetup?.dontAskAgain || false,
          },
        }),
      })

      if (!response.ok) throw new Error("Failed to update admin fill setting")
      setFormData((prev) => ({
        ...prev,
        profileSetup: { ...prev.profileSetup, willAdminFill: enabled },
      }))
    } catch (error) {
      console.error("Error updating admin fill setting:", error)
      setAdminWillFill(!enabled)
      Alert.alert("Error", `Failed to update admin fill setting: ${error.message}`)
    }
  }

  const formatDateToYYYYMMDD = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    if (isNaN(date)) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Navigate to the next section
  const handleNextSection = () => {
    if (currentSectionIndex < formSections.length - 1) {
      const nextIndex = currentSectionIndex + 1
      setCurrentSectionIndex(nextIndex)
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true })
    }
  }

  // Navigate to the previous section
  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      const prevIndex = currentSectionIndex - 1
      setCurrentSectionIndex(prevIndex)
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true })
    }
  }

  // Verification Badge Component
  const VerificationBadge = ({ status }) => {
    const getStatusConfig = () => {
      switch (status) {
        case "verified":
          return {
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            textColor: "text-emerald-700",
            icon: "checkmark-circle",
            iconColor: "#059669",
            text: "Verified Profile",
          }
        case "pending":
          return {
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
            textColor: "text-amber-700",
            icon: "time-outline",
            iconColor: "#D97706",
            text: "Verification Pending",
          }
        default:
          return {
            bgColor: "bg-rose-50",
            borderColor: "border-rose-200",
            textColor: "text-rose-700",
            icon: "shield-outline",
            iconColor: "#E11D48",
            text: "Verify Profile",
          }
      }
    }

    const config = getStatusConfig()

    return (
      <View
        className={`flex-row items-center px-3 py-2 rounded-full ${config.bgColor} ${config.borderColor} border mt-2 self-start`}
      >
        <Ionicons name={config.icon} size={14} color={config.iconColor} />
        <Text className={`ml-2 text-xs font-semibold ${config.textColor}`}>{config.text}</Text>
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
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <Reanimated.View
          entering={FadeInDown.duration(300).springify()}
          className="bg-white rounded-3xl w-full max-h-[70%] shadow-2xl"
        >
          <View className="flex-row justify-between items-center p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Profile Sections</Text>
            <TouchableOpacity
              onPress={() => setShowSectionModal(false)}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color={COLORS.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-6 pt-4" showsVerticalScrollIndicator={false}>
            {formSections.map((section, index) => (
              <TouchableOpacity
                key={section._id}
                onPress={() => {
                  setCurrentSectionIndex(index)
                  setShowSectionModal(false)
                  flatListRef.current?.scrollToIndex({ index, animated: true })
                }}
                className={`flex-row items-center p-4 rounded-2xl mb-3 ${
                  currentSectionIndex === index ? "bg-rose-50 border-2 border-rose-200" : "bg-gray-50"
                }`}
              >
                <LinearGradient
                  colors={currentSectionIndex === index ? [COLORS.primary, COLORS.secondary] : ["#F3F4F6", "#E5E7EB"]}
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                >
                  <MaterialCommunityIcons
                    name={section.icon}
                    size={24}
                    color={currentSectionIndex === index ? "#FFFFFF" : COLORS.onSurfaceVariant}
                  />
                </LinearGradient>
                <Text
                  className={`flex-1 text-base font-semibold ${
                    currentSectionIndex === index ? "text-rose-700" : "text-gray-700"
                  }`}
                >
                  {section.label}
                </Text>
                {currentSectionIndex === index && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Reanimated.View>
      </View>
    </Modal>
  )

  // Input Field Component
  const renderInputField = (field, value, onChangeText, error) => {
    const isRequired = field.required

    return (
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-3">
          {field.label}
          {isRequired && <Text className="text-red-500 ml-1">*</Text>}
        </Text>

        {field.type === "textarea" ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            multiline
            numberOfLines={4}
            className={`bg-white border-2 rounded-2xl p-4 text-base text-gray-900 min-h-[100px] shadow-sm ${
              error ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-rose-300"
            }`}
            style={{ textAlignVertical: "top" }}
            placeholderTextColor={COLORS.onSurfaceMuted}
          />
        ) : field.type === "select" ? (
          <TouchableOpacity
            onPress={() => {
              setSelectedField(field._id)
              setShowDropdown(!showDropdown)
            }}
            className={`bg-white border-2 rounded-2xl p-4 flex-row justify-between items-center shadow-sm ${
              error ? "border-red-300 bg-red-50" : "border-gray-200"
            }`}
          >
            <Text className={`text-base ${value ? "text-gray-900" : "text-gray-400"}`}>
              {value || field.placeholder}
            </Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.onSurfaceVariant} />
          </TouchableOpacity>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            className={`bg-white border-2 rounded-2xl p-4 text-base text-gray-900 shadow-sm ${
              error ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-rose-300"
            }`}
            placeholderTextColor={COLORS.onSurfaceMuted}
          />
        )}

        {error && <Text className="text-red-500 text-sm mt-2 ml-1">{error}</Text>}

        {showDropdown && selectedField === field._id && (
          <View className="bg-white border-2 border-gray-200 rounded-2xl mt-2 shadow-lg max-h-48">
            <ScrollView showsVerticalScrollIndicator={false}>
              {field.options?.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    onChangeText(option)
                    setShowDropdown(false)
                    setSelectedField(null)
                  }}
                  className={`p-4 border-b border-gray-100 ${value === option ? "bg-rose-50" : ""}`}
                >
                  <Text className={`text-base ${value === option ? "text-rose-700 font-semibold" : "text-gray-700"}`}>
                    {option}
                  </Text>
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
    <View className="mb-6">
      <Text className="text-sm font-semibold text-gray-700 mb-4">Profile Photos</Text>
      <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex-row">
        <Ionicons name="information-circle-outline" size={20} color="#D97706" />
        <View className="ml-3 flex-1">
          <Text className="text-amber-800 font-semibold text-sm mb-1">Photo Guidelines</Text>
          <Text className="text-amber-700 text-xs leading-4">
            Upload clear, recent photos that show your face. First photo will be your main profile picture.
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between">
        {photos.map((photo) => {
          const isPrimary = photo.id === 1

          return (
            <View key={photo.id} className="w-[48%] mb-4">
              <TouchableOpacity
                onPress={() => handlePhotoUpload(photo.id)}
                className={`aspect-square rounded-3xl border-2 border-dashed overflow-hidden shadow-sm ${
                  photo.url ? "border-rose-300 bg-rose-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                {photo.url ? (
                  <>
                    <Image source={{ uri: photo.url }} className="w-full h-full" />
                    {isPrimary && (
                      <View className="absolute top-3 right-3 bg-rose-500 px-2 py-1 rounded-lg">
                        <Text className="text-white text-xs font-bold text-center">MAIN</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Ionicons name="camera-outline" size={32} color={COLORS.onSurfaceMuted} />
                    <Text className="text-gray-400 text-xs mt-2 font-medium">
                      {isPrimary ? "Main Photo" : `Photo ${photo.id}`}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {photo.url && !isPrimary && (
                <View className="flex-row mt-2 space-x-2">
                  <TouchableOpacity
                    onPress={() => handleMakePrimary(photo.id)}
                    className="flex-1 bg-gray-100 py-2 rounded-xl"
                  >
                    <Text className="text-gray-700 text-xs font-semibold text-center">Make Main</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeletePhoto(photo.id)}
                    className="flex-1 bg-red-100 py-2 rounded-xl"
                  >
                    <Text className="text-red-600 text-xs font-semibold text-center">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )

  // Section Rendering Component
  const renderSection = ({ item: section }) => (
    <Reanimated.View entering={FadeIn.delay(200)} className="mb-6" style={{ width: screenWidth - 48 }}>
      <View className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        <LinearGradient colors={["#FFFFFF", "#FEFEFE"]} className="p-6 border-b border-gray-100">
         <View className="flex-row items-center">
  <View
    className="w-12 h-12 rounded-3xl items-center justify-center mr-4"
    style={{ backgroundColor: COLORS.primary }} // solid color instead of gradient
  >
    <MaterialCommunityIcons
      name={"alert-circle-outline"}
      size={24}
      color="#FFFFFF"
    />
  </View>

  <Text className="flex-1 text-xl font-bold text-gray-900 tracking-tight">
    {section.label}
  </Text>
</View>

        </LinearGradient>

        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
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
        </ScrollView>
      </View>
    </Reanimated.View>
  )

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="mt-4 text-base text-gray-600 font-medium">Loading your profile...</Text>
      </View>
    )
  }

  return (
<SafeAreaView className="flex-1 bg-gray-50">
  <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

  {/* Header (Fixed) */}
  <LinearGradient
    colors={["#FFFFFF", "#FEFEFE"]}
    className="px-6 pt-12 pb-6 rounded-b-3xl shadow-sm"
  >
    <View className="flex-row items-center mb-6 mt-6">
      <TouchableOpacity
        onPress={() => handlePhotoUpload(1)}
        className="relative mr-4 rounded-3xl"
      >
        <View className="w-24 h-24 rounded-3xl items-center justify-center p-1">
          {formData?.profilePhoto ? (
            <Image
              source={{ uri: formData.profilePhoto }}
              className="w-24 h-24 rounded-2xl bg-gray-100"
            />
          ) : (
            <View className="w-20 h-20 rounded-2xl bg-white/20 items-center justify-center">
              <Ionicons name="person-outline" size={32} color="#FFFFFF" />
            </View>
          )}

          <View className="absolute -bottom-1 -right-1 w-8 h-8 bg-rose-500 rounded-2xl items-center justify-center border-2 border-white shadow-lg">
            <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>

      <View className="flex-1">
        <Text className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">
          {formData?.name || "Your Name"}
        </Text>
        <View className="flex-row items-center mb-1">
          {formData?.height && (
            <Text className="text-sm text-gray-600 font-medium">
              {formData.height} •{" "}
            </Text>
          )}
          {formData?.religion && (
            <Text className="text-sm text-gray-600 font-medium">
              {formData.religion}
            </Text>
          )}
        </View>
        {formData?.currentCity && (
          <View className="flex-row items-center">
            <Ionicons
              name="location-outline"
              size={14}
              color={COLORS.onSurfaceVariant}
            />
            <Text className="text-sm text-gray-600 ml-1 font-medium">
              {formData.currentCity}
            </Text>
          </View>
        )}
        <VerificationBadge status={verificationStatus} />
      </View>
    </View>

    {/* Profile Completion */}
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-semibold text-gray-900">
          Profile Completion
        </Text>
        <Text className="text-base font-bold text-rose-600">
          {profileCompletion}%
        </Text>
      </View>

      <View className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <View
          className="h-3 rounded-full"
          style={{
            width: `${profileCompletion}%`,
            backgroundColor: COLORS.primary,
          }}
        />
      </View>

      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={() => setShowSectionModal(true)}
          className="flex-row items-center bg-gray-100 px-4 py-2 rounded-xl"
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={COLORS.onSurfaceVariant}
          />
          <Text className="text-sm font-medium text-gray-700 ml-2">
            Sections
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleProfileUpdate}
          disabled={isSaving}
          className="flex-row items-center bg-rose-500 px-4 py-2 rounded-xl"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="save-outline" size={16} color="#FFFFFF" />
              <Text className="text-sm font-semibold text-white ml-2">
                Save Profile
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  </LinearGradient>

  {/* Scrollable Content */}
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{ paddingBottom: 20 }}
    className="flex-1 px-6 pt-6"
  >
    {/* Section Navigation */}
    <View className="flex-row justify-between items-center mb-6">
      <TouchableOpacity
        onPress={handlePreviousSection}
        disabled={currentSectionIndex === 0}
        className={`p-3 rounded-2xl ${
          currentSectionIndex === 0 ? "bg-gray-100" : "bg-rose-100"
        }`}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={
            currentSectionIndex === 0
              ? COLORS.onSurfaceMuted
              : COLORS.primary
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowSectionModal(true)}
        className="flex-1 mx-4"
      >
        <Text
          className="text-lg font-bold text-gray-900 text-center"
          numberOfLines={1}
        >
          {formSections[currentSectionIndex]?.label}
        </Text>
        <Text className="text-sm text-gray-500 text-center">
          {currentSectionIndex + 1} of {formSections.length}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNextSection}
        disabled={currentSectionIndex === formSections.length - 1}
        className={`p-3 rounded-2xl ${
          currentSectionIndex === formSections.length - 1
            ? "bg-gray-100"
            : "bg-rose-100"
        }`}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={
            currentSectionIndex === formSections.length - 1
              ? COLORS.onSurfaceMuted
              : COLORS.primary
          }
        />
      </TouchableOpacity>
    </View>

    {/* Form Sections */}
    <FlatList
      ref={flatListRef}
      data={formSections}
      renderItem={renderSection}
      keyExtractor={(item) => item._id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      getItemLayout={(data, index) => ({
        length: screenWidth - 48,
        offset: (screenWidth - 48) * index,
        index,
      })}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  </ScrollView>

  {/* Section Modal */}
  <SectionModal />

  {/* Toast Notification */}
  <Toast />
</SafeAreaView>


  )
}

export default ProfileScreen
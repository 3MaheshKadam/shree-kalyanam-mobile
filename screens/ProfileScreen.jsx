// // "use client"

// // import { useState, useEffect, useRef } from "react"
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   TextInput,
// //   FlatList,
// //   Image,
// //   Modal,
// //   Dimensions,
// //   ScrollView,
// //   StatusBar,
// //   SafeAreaView,
// //   KeyboardAvoidingView,
// //   Platform,
// // } from "react-native"
// // import { useSession } from "context/SessionContext"
// // import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
// // import { LinearGradient } from "expo-linear-gradient"
// // import Reanimated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated"
// // import * as ImagePicker from "expo-image-picker"
// // import Toast from "react-native-toast-message"

// // const { width: screenWidth } = Dimensions.get("window")

// // // Unified Color Palette
// // const COLORS = {
// //   primary: "#FF6B6B",
// //   primaryDark: "#FF5252",
// //   inactive: "#94A3B8",
// //   inactiveLight: "#CBD5E1",
// //   background: "#ffffff",
// //   accent: "#F1F5F9",
// //   shadow: "#000000",
// //   success: "#10b981",
// //   warning: "#F59E0B",
// //   error: "#EF4444",
// //   gradient: ["#FF6B6B", "#FF5252"],
// //   gradientLight: ["#FFF5F5", "#FFE5E5"],
// // }

// // const ProfileScreen = () => {
// //   const { user } = useSession()
// //   const [formSections, setFormSections] = useState([])
// //   const [formData, setFormData] = useState({})
// //   const [isLoading, setIsLoading] = useState(true)
// //   const [isSaving, setIsSaving] = useState(false)
// //   const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
// //   const [profileCompletion, setProfileCompletion] = useState(0)
// //   const [verificationStatus, setVerificationStatus] = useState("Unverified")
// //   const [showSectionModal, setShowSectionModal] = useState(false)
// //   const [showDropdown, setShowDropdown] = useState(false)
// //   const [selectedField, setSelectedField] = useState(null)
// //   const [photos, setPhotos] = useState([
// //     { id: 1, url: null, isPrimary: true },
// //     { id: 2, url: null, isPrimary: false },
// //     { id: 3, url: null, isPrimary: false },
// //     { id: 4, url: null, isPrimary: false },
// //   ])
// //   const [fieldErrors, setFieldErrors] = useState({})
// //   const scrollViewRef = useRef(null)

// //   const fieldNameMappings = {
// //     "Full Name": "name",
// //     "Height": "height",
// //     "Weight": "weight",
// //     "Date of Birth": "dob",
// //     "Marital Status": "maritalStatus",
// //     "Mother Tongue": "motherTongue",
// //     "Current City": "currentCity",
// //     "Email Address": "email",
// //     "Permanent Address": "permanentAddress",
// //     "Gender": "gender",
// //     "Blood Group": "bloodGroup",
// //     "Complexion": "complexion",
// //     "Highest Education": "education",
// //     "Occupation": "occupation",
// //     "Field of Study": "fieldOfStudy",
// //     "Company": "company",
// //     "College/University": "college",
// //     "Annual Income": "income",
// //     "Father's Name": "fatherName",
// //     "Mother's Name": "mother",
// //     "Religion": "religion",
// //     "Sub Caste": "subCaste",
// //     "Caste": "caste",
// //     "Gothra": "gothra",
// //   }

// //   const normalizeFieldName = (name) => {
// //     return name.toLowerCase().replace(/[^a-z0-9]/g, "")
// //   }

// //   useEffect(() => {
// //     const loadData = async () => {
// //       if (!user?.id) {
// //         Alert.alert("Error", "User not authenticated")
// //         setIsLoading(false)
// //         return
// //       }

// //       try {
// //         const sectionsRes = await fetch("https://shiv-bandhan-testing.vercel.app/api/admin/form-sections")
// //         if (!sectionsRes.ok) throw new Error("Failed to fetch form sections")
// //         const sectionsData = await sectionsRes.json()

// //         const transformedSections = sectionsData.map((section) => ({
// //           ...section,
// //           id: section._id,
// //           fields: section.fields.map((field) => ({
// //             ...field,
// //             name: field.name,
// //             label: field.label,
// //             type: field.type,
// //             required: field.required,
// //             options: field.options || [],
// //             placeholder: field.placeholder || "",
// //           })),
// //         }))

// //         setFormSections(transformedSections)

// //         const userRes = await fetch(`https://shiv-bandhan-testing.vercel.app/api/users/${user.id}`)
// //         if (!userRes.ok) throw new Error("Failed to fetch user data")
// //         const userData = await userRes.json()

// //         const initialFormData = {}
// //         transformedSections.forEach((section) => {
// //           section.fields.forEach((field) => {
// //             const mappingEntry = Object.entries(fieldNameMappings).find(
// //               ([key]) => normalizeFieldName(key) === normalizeFieldName(field.name),
// //             )
// //             if (mappingEntry) {
// //               const [_, backendField] = mappingEntry
// //               if (userData[backendField] !== undefined) {
// //                 initialFormData[field.name] = userData[backendField]
// //               }
// //             }
// //           })
// //         })

// //         setFormData(initialFormData)
        
// //         if (userData.profilePhoto) {
// //           setPhotos((prevPhotos) =>
// //             prevPhotos.map((photo) => (photo.id === 1 ? { ...photo, url: userData.profilePhoto } : photo)),
// //           )
// //         }

// //         if (userData.verificationStatus) {
// //           setVerificationStatus(userData.verificationStatus)
// //         }

// //       } catch (error) {
// //         console.error("Error loading data:", error)
// //         Alert.alert("Error", `Failed to load profile: ${error.message}`)
// //       } finally {
// //         setIsLoading(false)
// //       }
// //     }

// //     loadData()
// //   }, [user])

// //   useEffect(() => {
// //     if (Object.keys(formData).length > 0 && formSections.length > 0) {
// //       setProfileCompletion(calculateProfileCompletion())
// //     }
// //   }, [formData, formSections])

// //   const calculateProfileCompletion = () => {
// //     if (!formSections.length) return 0

// //     const requiredFields = Object.keys(fieldNameMappings)
// //     let totalFields = requiredFields.length
// //     let filledFields = 0

// //     requiredFields.forEach((fieldName) => {
// //       const value = formData[fieldName]
// //       if (value !== undefined && value !== null && value !== "") {
// //         filledFields++
// //       }
// //     })

// //     totalFields++
// //     if (formData.profilePhoto || (photos[0] && photos[0].url)) {
// //       filledFields++
// //     }

// //     return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
// //   }

// //   const validateField = (field, value) => {
// //     if (field.required && (value === undefined || value === "" || value === null)) {
// //       return `${field.label} is required`
// //     }
// //     return ""
// //   }

// //   const handleInputChange = (fieldName, value, field) => {
// //     setFormData((prev) => ({ ...prev, [fieldName]: value }))
// //     if (field) {
// //       const error = validateField(field, value)
// //       setFieldErrors((prev) => ({ ...prev, [fieldName]: error }))
// //     }
// //     setShowDropdown(false)
// //   }

// //   const handleProfileUpdate = async () => {
// //     setIsSaving(true)
// //     try {
// //       const errors = {}
// //       formSections.forEach((section) => {
// //         section.fields.forEach((field) => {
// //           const error = validateField(field, formData[field.name])
// //           if (error) errors[field.name] = error
// //         })
// //       })

// //       if (Object.keys(errors).length > 0) {
// //         setFieldErrors(errors)
// //         Toast.show({
// //           type: "error",
// //           text1: "Missing Fields",
// //           text2: "Please fill all required fields",
// //           position: "bottom",
// //         })
// //         setIsSaving(false)
// //         return
// //       }

// //       const transformedData = {}
// //       Object.entries(fieldNameMappings).forEach(([displayName, backendField]) => {
// //         if (formData[displayName] !== undefined) {
// //           transformedData[backendField] = formData[displayName]
// //         }
// //       })

// //       const payload = {
// //         ...transformedData,
// //         userId: user?.id,
// //         profilePhoto: photos[0]?.url,
// //       }

// //       const response = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/update", {
// //         method: "PUT",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       })

// //       if (!response.ok) throw new Error("Failed to update profile")

// //       Toast.show({
// //         type: "success",
// //         text1: "Profile Updated",
// //         text2: "Your profile has been saved successfully",
// //         position: "bottom",
// //       })

// //     } catch (error) {
// //       console.error("Error updating profile:", error)
// //       Toast.show({
// //         type: "error",
// //         text1: "Update Failed",
// //         text2: error.message,
// //         position: "bottom",
// //       })
// //     } finally {
// //       setIsSaving(false)
// //     }
// //   }

// //   const handlePhotoUpload = async (photoId) => {
// //     try {
// //       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
// //       if (!permission.granted) {
// //         Alert.alert("Permission Denied", "Please allow access to your photo library")
// //         return
// //       }

// //       const result = await ImagePicker.launchImageLibraryAsync({
// //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //         allowsEditing: true,
// //         aspect: [1, 1],
// //         quality: 0.8,
// //       })

// //       if (!result.canceled) {
// //         const formDataUpload = new FormData()
// //         formDataUpload.append("file", {
// //           uri: result.assets[0].uri,
// //           type: "image/jpeg",
// //           name: `photo-${photoId}.jpg`,
// //         })
// //         formDataUpload.append("upload_preset", "shivbandhan")

// //         const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dqfum2awz/image/upload", {
// //           method: "POST",
// //           body: formDataUpload,
// //         })

// //         const uploadResult = await uploadResponse.json()
// //         if (uploadResult.secure_url) {
// //           setPhotos((prev) =>
// //             prev.map((photo) => (photo.id === photoId ? { ...photo, url: uploadResult.secure_url } : photo)),
// //           )
// //           if (photoId === 1) {
// //             handleInputChange("profilePhoto", uploadResult.secure_url)
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error uploading photo:", error)
// //       Alert.alert("Error", "Failed to upload photo")
// //     }
// //   }

// //   const handleDeletePhoto = (photoId) => {
// //     setPhotos((prevPhotos) => prevPhotos.map((photo) => (photo.id === photoId ? { ...photo, url: null } : photo)))
// //     if (photoId === 1) {
// //       handleInputChange("profilePhoto", null)
// //     }
// //   }

// //   const handleNextSection = () => {
// //     if (currentSectionIndex < formSections.length - 1) {
// //       setCurrentSectionIndex(currentSectionIndex + 1)
// //       scrollViewRef.current?.scrollTo({ y: 0, animated: true })
// //     }
// //   }

// //   const handlePreviousSection = () => {
// //     if (currentSectionIndex > 0) {
// //       setCurrentSectionIndex(currentSectionIndex - 1)
// //       scrollViewRef.current?.scrollTo({ y: 0, animated: true })
// //     }
// //   }

// //   // Enhanced Progress Timeline Component
// //   const ProgressTimeline = () => {
// //     return (
// //       <ScrollView 
// //         horizontal 
// //         showsHorizontalScrollIndicator={false}
// //         style={{ marginBottom: 20 }}
// //         contentContainerStyle={{ paddingHorizontal: 8 }}
// //       >
// //         <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
// //           {formSections.map((section, index) => (
// //             <TouchableOpacity
// //               key={section._id}
// //               onPress={() => {
// //                 setCurrentSectionIndex(index)
// //                 scrollViewRef.current?.scrollTo({ y: 0, animated: true })
// //               }}
// //               style={{ alignItems: 'center', marginHorizontal: 8 }}
// //             >
// //               {/* Connection line */}
// //               {index > 0 && (
// //                 <View style={{
// //                   position: 'absolute',
// //                   left: -16,
// //                   top: 20,
// //                   height: 2,
// //                   width: 16,
// //                   backgroundColor: index <= currentSectionIndex ? COLORS.primary : COLORS.inactiveLight,
// //                   zIndex: 1
// //                 }} />
// //               )}
              
// //               {/* Step circle */}
// //               <View style={{
// //                 width: 40,
// //                 height: 40,
// //                 borderRadius: 20,
// //                 backgroundColor: index === currentSectionIndex ? COLORS.primary : 
// //                                index < currentSectionIndex ? COLORS.success : COLORS.background,
// //                 borderWidth: 2,
// //                 borderColor: index <= currentSectionIndex ? COLORS.primary : COLORS.inactiveLight,
// //                 alignItems: 'center',
// //                 justifyContent: 'center',
// //                 zIndex: 2
// //               }}>
// //                 {index < currentSectionIndex ? (
// //                   <Ionicons name="checkmark" size={16} color={COLORS.background} />
// //                 ) : (
// //                   <Text style={{
// //                     color: index === currentSectionIndex ? COLORS.background : COLORS.inactive,
// //                     fontWeight: '600',
// //                     fontSize: 14
// //                   }}>{index + 1}</Text>
// //                 )}
// //               </View>
              
// //               {/* Section label */}
// //               <Text 
// //                 numberOfLines={1}
// //                 style={{
// //                   marginTop: 8,
// //                   fontSize: 12,
// //                   fontWeight: index === currentSectionIndex ? '700' : '500',
// //                   color: index === currentSectionIndex ? COLORS.primary : COLORS.inactive,
// //                   maxWidth: 80,
// //                   textAlign: 'center'
// //                 }}
// //               >
// //                 {section.label}
// //               </Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>
// //       </ScrollView>
// //     )
// //   }

// //   // Card Stack Form Component
// //   const CardStackForm = () => {
// //     const [cardStack, setCardStack] = useState([])
    
// //     useEffect(() => {
// //       // Create card stack with next 3 sections visible
// //       const stack = []
// //       for (let i = currentSectionIndex; i < Math.min(currentSectionIndex + 3, formSections.length); i++) {
// //         stack.push({ ...formSections[i], index: i })
// //       }
// //       setCardStack(stack)
// //     }, [currentSectionIndex, formSections])

// //     const renderCard = (section, stackIndex) => {
// //       const scale = 1 - (stackIndex * 0.1)
// //       const opacity = 1 - (stackIndex * 0.3)
// //       const translateY = stackIndex * 15
      
// //       return (
// //         <Reanimated.View
// //           key={section._id}
// //           entering={FadeInDown.delay(stackIndex * 100)}
// //           style={{
// //             position: stackIndex > 0 ? 'absolute' : 'relative',
// //             top: 0,
// //             left: 0,
// //             right: 0,
// //             transform: [{ scale }, { translateY }],
// //             opacity,
// //             zIndex: 3 - stackIndex,
// //             backgroundColor: COLORS.background,
// //             borderRadius: 24,
// //             padding: 24,
// //             marginBottom: stackIndex === 0 ? 60 : 0,
// //             shadowColor: COLORS.shadow,
// //             shadowOffset: { width: 0, height: stackIndex * 4 + 4 },
// //             shadowOpacity: 0.1 + (stackIndex * 0.05),
// //             shadowRadius: 8 + (stackIndex * 2),
// //             elevation: 3 + stackIndex,
// //             borderWidth: 1,
// //             borderColor: COLORS.accent
// //           }}
// //         >
// //           <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
// //             <View style={{
// //               width: 44,
// //               height: 44,
// //               borderRadius: 12,
// //               backgroundColor: `${COLORS.primary}15`,
// //               alignItems: 'center',
// //               justifyContent: 'center',
// //               marginRight: 12
// //             }}>
// //               <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.primary }}>
// //                 {section.index + 1}
// //               </Text>
// //             </View>
// //             <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', flex: 1 }}>
// //               {section.label}
// //             </Text>
// //           </View>

// //           {section.fields?.map((field) => {
// //             if (field.type === "photos") {
// //               return <View key={field._id}>{renderPhotoGrid()}</View>
// //             }
// //             const value = formData?.[field.name] || ""
// //             const errorMsg = fieldErrors?.[field.name]
// //             return (
// //               <View key={field._id}>
// //                 {renderInputField(field, value, (text) => handleInputChange(field.name, text, field), errorMsg)}
// //               </View>
// //             )
// //           })}

// //           {/* Card Actions */}
// //           <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
// //             <TouchableOpacity
// //               onPress={handlePreviousSection}
// //               disabled={currentSectionIndex === 0}
// //               style={{
// //                 flexDirection: 'row',
// //                 alignItems: 'center',
// //                 paddingVertical: 12,
// //                 paddingHorizontal: 20,
// //                 borderRadius: 16,
// //                 backgroundColor: currentSectionIndex === 0 ? COLORS.accent : `${COLORS.primary}10`
// //               }}
// //             >
// //               <Ionicons 
// //                 name="chevron-back" 
// //                 size={18} 
// //                 color={currentSectionIndex === 0 ? COLORS.inactive : COLORS.primary} 
// //               />
// //               <Text style={{
// //                 marginLeft: 6,
// //                 fontSize: 14,
// //                 fontWeight: '600',
// //                 color: currentSectionIndex === 0 ? COLORS.inactive : COLORS.primary
// //               }}>
// //                 Previous
// //               </Text>
// //             </TouchableOpacity>

// //             <TouchableOpacity
// //               onPress={handleNextSection}
// //               disabled={currentSectionIndex === formSections.length - 1}
// //               style={{
// //                 flexDirection: 'row',
// //                 alignItems: 'center',
// //                 paddingVertical: 12,
// //                 paddingHorizontal: 20,
// //                 borderRadius: 16,
// //                 backgroundColor: currentSectionIndex === formSections.length - 1 ? COLORS.accent : COLORS.primary
// //               }}
// //             >
// //               <Text style={{
// //                 marginRight: 6,
// //                 fontSize: 14,
// //                 fontWeight: '600',
// //                 color: currentSectionIndex === formSections.length - 1 ? COLORS.inactive : COLORS.background
// //               }}>
// //                 Next
// //               </Text>
// //               <Ionicons 
// //                 name="chevron-forward" 
// //                 size={18} 
// //                 color={currentSectionIndex === formSections.length - 1 ? COLORS.inactive : COLORS.background} 
// //               />
// //             </TouchableOpacity>
// //           </View>
// //         </Reanimated.View>
// //       )
// //     }

// //     return (
// //       <View style={{ minHeight: 500, marginBottom: 20 }}>
// //         {cardStack.map((section, index) => renderCard(section, index))}
// //       </View>
// //     )
// //   }

// //   // Enhanced Header Component
// //   const EnhancedProfileHeader = () => (
// //     <LinearGradient colors={COLORS.gradient} style={{ padding: 24, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
// //       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
// //         <View style={{ flex: 1 }}>
// //           <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.background, marginBottom: 8 }}>
// //             Complete Your Profile
// //           </Text>
// //           <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 16 }}>
// //             {profileCompletion < 50 ? "Let's start building your story" : 
// //              profileCompletion < 80 ? "You're doing great!" : "Almost there!"}
// //           </Text>
          
// //           {/* Quick Stats */}
// //           <View style={{ flexDirection: 'row', marginBottom: 16 }}>
// //             <View style={{ marginRight: 24 }}>
// //               <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Completed</Text>
// //               <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.background }}>
// //                 {profileCompletion}%
// //               </Text>
// //             </View>
// //             <View>
// //               <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Remaining</Text>
// //               <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.background }}>
// //                 {100 - profileCompletion}%
// //               </Text>
// //             </View>
// //           </View>
// //         </View>
        
// //         <TouchableOpacity onPress={() => handlePhotoUpload(1)}>
// //           <View style={{
// //             width: 80,
// //             height: 80,
// //             borderRadius: 20,
// //             backgroundColor: 'rgba(255,255,255,0.2)',
// //             alignItems: 'center',
// //             justifyContent: 'center',
// //             borderWidth: 2,
// //             borderColor: 'rgba(255,255,255,0.3)',
// //             overflow: 'hidden'
// //           }}>
// //             {formData?.profilePhoto ? (
// //               <Image source={{ uri: formData.profilePhoto }} style={{ width: '100%', height: '100%', borderRadius: 18 }} />
// //             ) : (
// //               <Ionicons name="person-add" size={24} color={COLORS.background} />
// //             )}
// //           </View>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Progress with segments */}
// //       <View style={{ marginBottom: 16 }}>
// //         <View style={{
// //           flexDirection: 'row',
// //           height: 6,
// //           backgroundColor: 'rgba(255,255,255,0.3)',
// //           borderRadius: 3,
// //           overflow: 'hidden'
// //         }}>
// //           {formSections.map((_, index) => (
// //             <View 
// //               key={index}
// //               style={{
// //                 flex: 1,
// //                 backgroundColor: index <= currentSectionIndex ? COLORS.background : 'transparent',
// //                 marginRight: index < formSections.length - 1 ? 2 : 0
// //               }}
// //             />
// //           ))}
// //         </View>
// //       </View>

// //       {/* Quick Actions */}
// //       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
// //         <View style={{ flexDirection: 'row' }}>
// //           <TouchableOpacity 
// //             style={{
// //               flexDirection: 'row',
// //               alignItems: 'center',
// //               backgroundColor: 'rgba(255,255,255,0.2)',
// //               paddingHorizontal: 16,
// //               paddingVertical: 8,
// //               borderRadius: 20,
// //               marginRight: 8
// //             }}
// //             onPress={() => setShowSectionModal(true)}
// //           >
// //             <Ionicons name="layers" size={16} color={COLORS.background} />
// //             <Text style={{ color: COLORS.background, marginLeft: 6, fontWeight: '600', fontSize: 13 }}>
// //               All Sections
// //             </Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity 
// //             style={{
// //               flexDirection: 'row',
// //               alignItems: 'center',
// //               backgroundColor: 'rgba(255,255,255,0.2)',
// //               paddingHorizontal: 16,
// //               paddingVertical: 8,
// //               borderRadius: 20,
// //               marginRight: 8
// //             }}
// //             onPress={handleProfileUpdate}
// //           >
// //             <Ionicons name="cloud-upload" size={16} color={COLORS.background} />
// //             <Text style={{ color: COLORS.background, marginLeft: 6, fontWeight: '600', fontSize: 13 }}>
// //               {isSaving ? 'Saving...' : 'Save Progress'}
// //             </Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity 
// //             style={{
// //               flexDirection: 'row',
// //               alignItems: 'center',
// //               backgroundColor: 'rgba(255,255,255,0.2)',
// //               paddingHorizontal: 16,
// //               paddingVertical: 8,
// //               borderRadius: 20
// //             }}
// //             onPress={() => {
// //               // Jump to next incomplete section
// //               const nextIncomplete = formSections.findIndex((section, index) => 
// //                 index > currentSectionIndex && 
// //                 section.fields.some(field => !formData[field.name] && field.required)
// //               )
// //               if (nextIncomplete !== -1) setCurrentSectionIndex(nextIncomplete)
// //             }}
// //           >
// //             <Ionicons name="flash" size={16} color={COLORS.background} />
// //             <Text style={{ color: COLORS.background, marginLeft: 6, fontWeight: '600', fontSize: 13 }}>
// //               Skip to Next
// //             </Text>
// //           </TouchableOpacity>
// //         </View>
// //       </ScrollView>
// //     </LinearGradient>
// //   )

// //   // Verification Badge Component
// //   const VerificationBadge = ({ status }) => {
// //     const getStatusConfig = () => {
// //       switch (status?.toLowerCase()) {
// //         case "verified":
// //           return {
// //             icon: "checkmark-circle",
// //             iconColor: COLORS.success,
// //             text: "Verified",
// //             bgColor: "rgba(16, 185, 129, 0.1)",
// //           }
// //         case "pending":
// //           return {
// //             icon: "time-outline",
// //             iconColor: COLORS.warning,
// //             text: "Pending",
// //             bgColor: "rgba(245, 158, 11, 0.1)",
// //           }
// //         default:
// //           return {
// //             icon: "shield-outline",
// //             iconColor: COLORS.primary,
// //             text: "Unverified",
// //             bgColor: "rgba(255, 107, 107, 0.1)",
// //           }
// //       }
// //     }

// //     const config = getStatusConfig()

// //     return (
// //       <View style={{
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingHorizontal: 10,
// //         paddingVertical: 4,
// //         borderRadius: 12,
// //         backgroundColor: config.bgColor,
// //         alignSelf: 'flex-start',
// //         marginTop: 6
// //       }}>
// //         <Ionicons name={config.icon} size={12} color={config.iconColor} />
// //         <Text style={{
// //           marginLeft: 4,
// //           fontSize: 11,
// //           fontWeight: '600',
// //           color: config.iconColor
// //         }}>{config.text}</Text>
// //       </View>
// //     )
// //   }

// //   // Section Modal Component
// //   const SectionModal = () => (
// //     <Modal
// //       visible={showSectionModal}
// //       transparent
// //       animationType="fade"
// //       onRequestClose={() => setShowSectionModal(false)}
// //     >
// //       <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
// //         <Reanimated.View
// //           entering={FadeInDown.duration(300).springify()}
// //           style={{
// //             backgroundColor: COLORS.background,
// //             borderRadius: 24,
// //             width: '100%',
// //             maxHeight: '70%',
// //             shadowColor: COLORS.shadow,
// //             shadowOffset: { width: 0, height: 10 },
// //             shadowOpacity: 0.3,
// //             shadowRadius: 20,
// //             elevation: 10
// //           }}
// //         >
// //           <View style={{
// //             flexDirection: 'row',
// //             justifyContent: 'space-between',
// //             alignItems: 'center',
// //             padding: 20,
// //             borderBottomWidth: 1,
// //             borderBottomColor: COLORS.accent
// //           }}>
// //             <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827' }}>Profile Sections</Text>
// //             <TouchableOpacity
// //               onPress={() => setShowSectionModal(false)}
// //               style={{
// //                 width: 32,
// //                 height: 32,
// //                 borderRadius: 16,
// //                 backgroundColor: COLORS.accent,
// //                 alignItems: 'center',
// //                 justifyContent: 'center'
// //               }}
// //             >
// //               <Ionicons name="close" size={18} color={COLORS.inactive} />
// //             </TouchableOpacity>
// //           </View>

// //           <ScrollView style={{ padding: 20 }} showsVerticalScrollIndicator={false}>
// //             {formSections.map((section, index) => (
// //               <TouchableOpacity
// //                 key={section._id}
// //                 onPress={() => {
// //                   setCurrentSectionIndex(index)
// //                   setShowSectionModal(false)
// //                   scrollViewRef.current?.scrollTo({ y: 0, animated: true })
// //                 }}
// //                 style={{
// //                   flexDirection: 'row',
// //                   alignItems: 'center',
// //                   padding: 16,
// //                   borderRadius: 16,
// //                   marginBottom: 12,
// //                   backgroundColor: currentSectionIndex === index ? `${COLORS.primary}15` : COLORS.accent,
// //                   borderWidth: 2,
// //                   borderColor: currentSectionIndex === index ? COLORS.primary : 'transparent'
// //                 }}
// //               >
// //                 <View style={{
// //                   width: 44,
// //                   height: 44,
// //                   borderRadius: 12,
// //                   backgroundColor: currentSectionIndex === index ? COLORS.primary : COLORS.background,
// //                   alignItems: 'center',
// //                   justifyContent: 'center',
// //                   marginRight: 14
// //                 }}>
// //                   <Text style={{
// //                     fontSize: 16,
// //                     fontWeight: '700',
// //                     color: currentSectionIndex === index ? COLORS.background : COLORS.primary
// //                   }}>
// //                     {index + 1}
// //                   </Text>
// //                 </View>
// //                 <Text style={{
// //                   flex: 1,
// //                   fontSize: 15,
// //                   fontWeight: currentSectionIndex === index ? '700' : '600',
// //                   color: currentSectionIndex === index ? COLORS.primary : '#374151'
// //                 }}>{section.label}</Text>
// //                 {currentSectionIndex === index && (
// //                   <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
// //                 )}
// //               </TouchableOpacity>
// //             ))}
// //           </ScrollView>
// //         </Reanimated.View>
// //       </View>
// //     </Modal>
// //   )

// //   // Input Field Component
// //   const renderInputField = (field, value, onChangeText, error) => {
// //     return (
// //       <View style={{ marginBottom: 20 }}>
// //         <Text style={{
// //           fontSize: 14,
// //           fontWeight: '600',
// //           color: '#374151',
// //           marginBottom: 10
// //         }}>
// //           {field.label}
// //           {field.required && <Text style={{ color: COLORS.error }}> *</Text>}
// //         </Text>

// //         {field.type === "textarea" ? (
// //           <TextInput
// //             value={value}
// //             onChangeText={onChangeText}
// //             placeholder={field.placeholder}
// //             multiline
// //             numberOfLines={4}
// //             style={{
// //               backgroundColor: COLORS.background,
// //               borderWidth: 2,
// //               borderColor: error ? COLORS.error : COLORS.accent,
// //               borderRadius: 16,
// //               padding: 14,
// //               fontSize: 15,
// //               color: '#111827',
// //               minHeight: 100,
// //               textAlignVertical: 'top'
// //             }}
// //             placeholderTextColor={COLORS.inactive}
// //           />
// //         ) : field.type === "select" ? (
// //           <TouchableOpacity
// //             onPress={() => {
// //               setSelectedField(field._id)
// //               setShowDropdown(!showDropdown)
// //             }}
// //             style={{
// //               backgroundColor: COLORS.background,
// //               borderWidth: 2,
// //               borderColor: error ? COLORS.error : COLORS.accent,
// //               borderRadius: 16,
// //               padding: 14,
// //               flexDirection: 'row',
// //               justifyContent: 'space-between',
// //               alignItems: 'center'
// //             }}
// //           >
// //             <Text style={{ fontSize: 15, color: value ? '#111827' : COLORS.inactive }}>
// //               {value || field.placeholder}
// //             </Text>
// //             <Ionicons name="chevron-down" size={18} color={COLORS.inactive} />
// //           </TouchableOpacity>
// //         ) : (
// //           <TextInput
// //             value={value}
// //             onChangeText={onChangeText}
// //             placeholder={field.placeholder}
// //             style={{
// //               backgroundColor: COLORS.background,
// //               borderWidth: 2,
// //               borderColor: error ? COLORS.error : COLORS.accent,
// //               borderRadius: 16,
// //               padding: 14,
// //               fontSize: 15,
// //               color: '#111827'
// //             }}
// //             placeholderTextColor={COLORS.inactive}
// //           />
// //         )}

// //         {error && <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 6, marginLeft: 4 }}>{error}</Text>}

// //         {showDropdown && selectedField === field._id && (
// //           <View style={{
// //             backgroundColor: COLORS.background,
// //             borderWidth: 2,
// //             borderColor: COLORS.accent,
// //             borderRadius: 16,
// //             marginTop: 8,
// //             maxHeight: 200,
// //             shadowColor: COLORS.shadow,
// //             shadowOffset: { width: 0, height: 4 },
// //             shadowOpacity: 0.1,
// //             shadowRadius: 8,
// //             elevation: 4
// //           }}>
// //             <ScrollView showsVerticalScrollIndicator={false}>
// //               {field.options?.map((option, index) => (
// //                 <TouchableOpacity
// //                   key={index}
// //                   onPress={() => {
// //                     onChangeText(option)
// //                     setShowDropdown(false)
// //                     setSelectedField(null)
// //                   }}
// //                   style={{
// //                     padding: 14,
// //                     borderBottomWidth: index < field.options.length - 1 ? 1 : 0,
// //                     borderBottomColor: COLORS.accent,
// //                     backgroundColor: value === option ? `${COLORS.primary}10` : 'transparent'
// //                   }}
// //                 >
// //                   <Text style={{
// //                     fontSize: 15,
// //                     color: value === option ? COLORS.primary : '#374151',
// //                     fontWeight: value === option ? '600' : '400'
// //                   }}>{option}</Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </ScrollView>
// //           </View>
// //         )}
// //       </View>
// //     )
// //   }

// //   // Photo Grid Component
// //   const renderPhotoGrid = () => (
// //     <View style={{ marginBottom: 24 }}>
// //       <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 12 }}>Profile Photos</Text>
      
// //       <View style={{
// //         backgroundColor: `${COLORS.warning}15`,
// //         borderRadius: 16,
// //         padding: 14,
// //         marginBottom: 16,
// //         flexDirection: 'row',
// //         alignItems: 'flex-start'
// //       }}>
// //         <Ionicons name="information-circle-outline" size={18} color={COLORS.warning} style={{ marginTop: 2 }} />
// //         <Text style={{
// //           marginLeft: 10,
// //           flex: 1,
// //           fontSize: 12,
// //           color: '#92400E',
// //           lineHeight: 18
// //         }}>Upload clear, recent photos. First photo will be your main profile picture.</Text>
// //       </View>

// //       <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
// //         {photos.map((photo) => {
// //           const isPrimary = photo.id === 1

// //           return (
// //             <View key={photo.id} style={{ width: '48%', marginBottom: 14 }}>
// //               <TouchableOpacity
// //                 onPress={() => handlePhotoUpload(photo.id)}
// //                 style={{
// //                   aspectRatio: 1,
// //                   borderRadius: 20,
// //                   borderWidth: 2,
// //                   borderStyle: 'dashed',
// //                   borderColor: photo.url ? COLORS.primary : COLORS.inactiveLight,
// //                   backgroundColor: photo.url ? 'transparent' : COLORS.accent,
// //                   overflow: 'hidden'
// //                 }}
// //               >
// //                 {photo.url ? (
// //                   <>
// //                     <Image source={{ uri: photo.url }} style={{ width: '100%', height: '100%' }} />
// //                     {isPrimary && (
// //                       <View style={{
// //                         position: 'absolute',
// //                         top: 10,
// //                         right: 10,
// //                         backgroundColor: COLORS.primary,
// //                         paddingHorizontal: 8,
// //                         paddingVertical: 4,
// //                         borderRadius: 8
// //                       }}>
// //                         <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: '700' }}>MAIN</Text>
// //                       </View>
// //                     )}
// //                   </>
// //                 ) : (
// //                   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
// //                     <Ionicons name="camera-outline" size={28} color={COLORS.inactive} />
// //                     <Text style={{ color: COLORS.inactive, fontSize: 11, marginTop: 8, fontWeight: '500' }}>
// //                       {isPrimary ? "Main Photo" : `Photo ${photo.id}`}
// //                     </Text>
// //                   </View>
// //                 )}
// //               </TouchableOpacity>

// //               {photo.url && (
// //                 <TouchableOpacity
// //                   onPress={() => handleDeletePhoto(photo.id)}
// //                   style={{
// //                     marginTop: 8,
// //                     backgroundColor: `${COLORS.error}15`,
// //                     paddingVertical: 8,
// //                     borderRadius: 12,
// //                     alignItems: 'center'
// //                   }}
// //                 >
// //                   <Text style={{ color: COLORS.error, fontSize: 12, fontWeight: '600' }}>Delete</Text>
// //                 </TouchableOpacity>
// //               )}
// //             </View>
// //           )
// //         })}
// //       </View>
// //     </View>
// //   )

// //   if (isLoading) {
// //     return (
// //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.accent }}>
// //         <ActivityIndicator size="large" color={COLORS.primary} />
// //         <Text style={{ marginTop: 16, fontSize: 15, color: COLORS.inactive, fontWeight: '500' }}>
// //           Loading your profile...
// //         </Text>
// //       </View>
// //     )
// //   }

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.accent }}>
// //       <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
// //       <KeyboardAvoidingView 
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //         style={{ flex: 1 }}
// //         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
// //       >
// //         <ScrollView 
// //           ref={scrollViewRef}
// //           showsVerticalScrollIndicator={false}
// //           contentContainerStyle={{ paddingBottom: 30 }}
// //         >
// //           {/* Enhanced Header */}
// //           <EnhancedProfileHeader />

// //           {/* Content Area */}
// //           <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
// //             {/* Progress Timeline */}
// //             <ProgressTimeline />

// //             {/* Card Stack Form */}
// //             <CardStackForm />
// //           </View>
// //         </ScrollView>
// //       </KeyboardAvoidingView>

// //       {/* Section Modal */}
// //       <SectionModal />

// //       {/* Toast Notification */}
// //       <Toast />
// //     </SafeAreaView>
// //   )
// // }

// // export default ProfileScreen
// "use client"

// import { useState, useEffect, useRef } from "react"
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   Image,
//   Modal,
//   Dimensions,
//   ScrollView,
//   StatusBar,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native"
// import { useSession } from "context/SessionContext"
// import { Ionicons } from "@expo/vector-icons"
// import { LinearGradient } from "expo-linear-gradient"
// import Reanimated, { FadeIn, FadeInDown } from "react-native-reanimated"
// import * as ImagePicker from "expo-image-picker"
// import Toast from "react-native-toast-message"

// const { width: screenWidth } = Dimensions.get("window")

// // Professional Color Palette - Red Theme
// const COLORS = {
//   primary: "#f87171",
//   primaryDark: "#dc2626",
//   primaryLight: "#fca5a5",
//   inactive: "#94A3B8",
//   inactiveLight: "#CBD5E1",
//   background: "#ffffff",
//   surface: "#fafafa",
//   border: "#e5e7eb",
//   text: "#111827",
//   textSecondary: "#6b7280",
//   success: "#10b981",
//   warning: "#f59e0b",
//   error: "#ef4444",
//   gradient: ["#f87171", "#dc2626"],
// }

// const ProfileScreen = () => {
//   const { user } = useSession()
//   const [formSections, setFormSections] = useState([])
//   const [formData, setFormData] = useState({})
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
//   const [profileCompletion, setProfileCompletion] = useState(0)
//   const [showSectionModal, setShowSectionModal] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [selectedField, setSelectedField] = useState(null)
//   const [photos, setPhotos] = useState([
//     { id: 1, url: null, isPrimary: true },
//     { id: 2, url: null, isPrimary: false },
//     { id: 3, url: null, isPrimary: false },
//     { id: 4, url: null, isPrimary: false },
//   ])
//   const [fieldErrors, setFieldErrors] = useState({})
//   const scrollViewRef = useRef(null)

//   const fieldNameMappings = {
//     "Full Name": "name",
//     "Height": "height",
//     "Weight": "weight",
//     "Date of Birth": "dob",
//     "Marital Status": "maritalStatus",
//     "Mother Tongue": "motherTongue",
//     "Current City": "currentCity",
//     "Email Address": "email",
//     "Permanent Address": "permanentAddress",
//     "Gender": "gender",
//     "Blood Group": "bloodGroup",
//     "Complexion": "complexion",
//     "Highest Education": "education",
//     "Occupation": "occupation",
//     "Field of Study": "fieldOfStudy",
//     "Company": "company",
//     "College/University": "college",
//     "Annual Income": "income",
//     "Father's Name": "fatherName",
//     "Mother's Name": "mother",
//     "Religion": "religion",
//     "Sub Caste": "subCaste",
//     "Caste": "caste",
//     "Gothra": "gothra",
//   }

//   const normalizeFieldName = (name) => {
//     return name.toLowerCase().replace(/[^a-z0-9]/g, "")
//   }

//   useEffect(() => {
//     const loadData = async () => {
//       if (!user?.id) {
//         Alert.alert("Error", "User not authenticated")
//         setIsLoading(false)
//         return
//       }

//       try {
//         const sectionsRes = await fetch("https://shiv-bandhan-testing.vercel.app/api/admin/form-sections")
//         if (!sectionsRes.ok) throw new Error("Failed to fetch form sections")
//         const sectionsData = await sectionsRes.json()

//         const transformedSections = sectionsData.map((section) => ({
//           ...section,
//           id: section._id,
//           fields: section.fields.map((field) => ({
//             ...field,
//             name: field.name,
//             label: field.label,
//             type: field.type,
//             required: field.required,
//             options: field.options || [],
//             placeholder: field.placeholder || "",
//           })),
//         }))

//         setFormSections(transformedSections)

//         const userRes = await fetch(`https://shiv-bandhan-testing.vercel.app/api/users/${user.id}`)
//         if (!userRes.ok) throw new Error("Failed to fetch user data")
//         const userData = await userRes.json()

//         const initialFormData = {}
//         transformedSections.forEach((section) => {
//           section.fields.forEach((field) => {
//             const mappingEntry = Object.entries(fieldNameMappings).find(
//               ([key]) => normalizeFieldName(key) === normalizeFieldName(field.name),
//             )
//             if (mappingEntry) {
//               const [_, backendField] = mappingEntry
//               if (userData[backendField] !== undefined) {
//                 initialFormData[field.name] = userData[backendField]
//               }
//             }
//           })
//         })

//         setFormData(initialFormData)
        
//         if (userData.profilePhoto) {
//           setPhotos((prevPhotos) =>
//             prevPhotos.map((photo) => (photo.id === 1 ? { ...photo, url: userData.profilePhoto } : photo)),
//           )
//         }

//       } catch (error) {
//         console.error("Error loading data:", error)
//         Alert.alert("Error", `Failed to load profile: ${error.message}`)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadData()
//   }, [user])

//   useEffect(() => {
//     if (Object.keys(formData).length > 0 && formSections.length > 0) {
//       setProfileCompletion(calculateProfileCompletion())
//     }
//   }, [formData, formSections])

//   const calculateProfileCompletion = () => {
//     if (!formSections.length) return 0

//     const requiredFields = Object.keys(fieldNameMappings)
//     let totalFields = requiredFields.length
//     let filledFields = 0

//     requiredFields.forEach((fieldName) => {
//       const value = formData[fieldName]
//       if (value !== undefined && value !== null && value !== "") {
//         filledFields++
//       }
//     })

//     totalFields++
//     if (formData.profilePhoto || (photos[0] && photos[0].url)) {
//       filledFields++
//     }

//     return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
//   }

//   const validateField = (field, value) => {
//     if (field.required && (value === undefined || value === "" || value === null)) {
//       return `${field.label} is required`
//     }
//     return ""
//   }

//   const handleInputChange = (fieldName, value, field) => {
//     setFormData((prev) => ({ ...prev, [fieldName]: value }))
//     if (field) {
//       const error = validateField(field, value)
//       setFieldErrors((prev) => ({ ...prev, [fieldName]: error }))
//     }
//     setShowDropdown(false)
//   }

//   const handleProfileUpdate = async () => {
//     setIsSaving(true)
//     try {
//       const errors = {}
//       formSections.forEach((section) => {
//         section.fields.forEach((field) => {
//           const error = validateField(field, formData[field.name])
//           if (error) errors[field.name] = error
//         })
//       })

//       if (Object.keys(errors).length > 0) {
//         setFieldErrors(errors)
//         Toast.show({
//           type: "error",
//           text1: "Missing Fields",
//           text2: "Please fill all required fields",
//           position: "bottom",
//         })
//         setIsSaving(false)
//         return
//       }

//       const transformedData = {}
//       Object.entries(fieldNameMappings).forEach(([displayName, backendField]) => {
//         if (formData[displayName] !== undefined) {
//           transformedData[backendField] = formData[displayName]
//         }
//       })

//       const payload = {
//         ...transformedData,
//         userId: user?.id,
//         profilePhoto: photos[0]?.url,
//       }

//       const response = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/update", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })

//       if (!response.ok) throw new Error("Failed to update profile")

//       Toast.show({
//         type: "success",
//         text1: "Profile Updated",
//         text2: "Your changes have been saved",
//         position: "bottom",
//       })

//     } catch (error) {
//       console.error("Error updating profile:", error)
//       Toast.show({
//         type: "error",
//         text1: "Update Failed",
//         text2: error.message,
//         position: "bottom",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handlePhotoUpload = async (photoId) => {
//     try {
//       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
//       if (!permission.granted) {
//         Alert.alert("Permission Denied", "Please allow access to your photo library")
//         return
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       })

//       if (!result.canceled) {
//         const formDataUpload = new FormData()
//         formDataUpload.append("file", {
//           uri: result.assets[0].uri,
//           type: "image/jpeg",
//           name: `photo-${photoId}.jpg`,
//         })
//         formDataUpload.append("upload_preset", "shivbandhan")

//         const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dqfum2awz/image/upload", {
//           method: "POST",
//           body: formDataUpload,
//         })

//         const uploadResult = await uploadResponse.json()
//         if (uploadResult.secure_url) {
//           setPhotos((prev) =>
//             prev.map((photo) => (photo.id === photoId ? { ...photo, url: uploadResult.secure_url } : photo)),
//           )
//           if (photoId === 1) {
//             handleInputChange("profilePhoto", uploadResult.secure_url)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error uploading photo:", error)
//       Alert.alert("Error", "Failed to upload photo")
//     }
//   }

//   const handleDeletePhoto = (photoId) => {
//     setPhotos((prevPhotos) => prevPhotos.map((photo) => (photo.id === photoId ? { ...photo, url: null } : photo)))
//     if (photoId === 1) {
//       handleInputChange("profilePhoto", null)
//     }
//   }

//   // Professional Header Component
//   const ProfileHeader = () => (
//     <View style={{
//       backgroundColor: COLORS.background,
//       paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20,
//       paddingBottom: 24,
//       paddingHorizontal: 24,
//       borderBottomWidth: 1,
//       borderBottomColor: COLORS.border,
//     }}>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//         <View style={{ flex: 1 }}>
//           <Text style={{ 
//             fontSize: 28, 
//             fontWeight: '800', 
//             color: COLORS.text,
//             letterSpacing: -0.5,
//             marginBottom: 4
//           }}>
//             Edit Profile
//           </Text>
//           <Text style={{ fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' }}>
//             Complete your profile to get better matches
//           </Text>
//         </View>
        
//         <TouchableOpacity 
//           onPress={handleProfileUpdate}
//           disabled={isSaving}
//           style={{
//             backgroundColor: COLORS.primary,
//             paddingHorizontal: 20,
//             paddingVertical: 12,
//             borderRadius: 12,
//             shadowColor: COLORS.primary,
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.2,
//             shadowRadius: 4,
//             elevation: 3,
//           }}
//         >
//           <Text style={{ color: COLORS.background, fontSize: 14, fontWeight: '700' }}>
//             {isSaving ? 'Saving...' : 'Save'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Progress Bar */}
//       <View style={{ marginBottom: 16 }}>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
//           <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textSecondary }}>
//             Profile Completion
//           </Text>
//           <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>
//             {profileCompletion}%
//           </Text>
//         </View>
//         <View style={{
//           height: 6,
//           backgroundColor: COLORS.surface,
//           borderRadius: 3,
//           overflow: 'hidden'
//         }}>
//           <View style={{
//             width: `${profileCompletion}%`,
//             height: '100%',
//             backgroundColor: COLORS.primary,
//             borderRadius: 3,
//           }} />
//         </View>
//       </View>

//       {/* Section Navigation */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ paddingVertical: 4 }}
//       >
//         {formSections.map((section, index) => (
//           <TouchableOpacity
//             key={section._id}
//             onPress={() => {
//               setCurrentSectionIndex(index)
//               scrollViewRef.current?.scrollTo({ y: 0, animated: true })
//             }}
//             style={{
//               paddingHorizontal: 16,
//               paddingVertical: 8,
//               borderRadius: 20,
//               backgroundColor: currentSectionIndex === index ? COLORS.primary : COLORS.surface,
//               marginRight: 8,
//               borderWidth: 1,
//               borderColor: currentSectionIndex === index ? COLORS.primary : COLORS.border,
//             }}
//           >
//             <Text style={{
//               fontSize: 13,
//               fontWeight: '600',
//               color: currentSectionIndex === index ? COLORS.background : COLORS.textSecondary
//             }}>
//               {section.label}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </View>
//   )

//   // Professional Input Field Component
//   const renderInputField = (field, value, onChangeText, error) => {
//     return (
//       <View style={{ marginBottom: 20 }}>
//         <Text style={{
//           fontSize: 13,
//           fontWeight: '600',
//           color: COLORS.text,
//           marginBottom: 8,
//           letterSpacing: 0.2
//         }}>
//           {field.label}
//           {field.required && <Text style={{ color: COLORS.error }}> *</Text>}
//         </Text>

//         {field.type === "textarea" ? (
//           <TextInput
//             value={value}
//             onChangeText={onChangeText}
//             placeholder={field.placeholder}
//             multiline
//             numberOfLines={4}
//             style={{
//               backgroundColor: COLORS.background,
//               borderWidth: 1,
//               borderColor: error ? COLORS.error : COLORS.border,
//               borderRadius: 12,
//               padding: 14,
//               fontSize: 15,
//               color: COLORS.text,
//               minHeight: 100,
//               textAlignVertical: 'top',
//               fontWeight: '400'
//             }}
//             placeholderTextColor={COLORS.inactive}
//           />
//         ) : field.type === "select" ? (
//           <TouchableOpacity
//             onPress={() => {
//               setSelectedField(field._id)
//               setShowDropdown(!showDropdown)
//             }}
//             style={{
//               backgroundColor: COLORS.background,
//               borderWidth: 1,
//               borderColor: error ? COLORS.error : COLORS.border,
//               borderRadius: 12,
//               padding: 14,
//               flexDirection: 'row',
//               justifyContent: 'space-between',
//               alignItems: 'center'
//             }}
//           >
//             <Text style={{ 
//               fontSize: 15, 
//               color: value ? COLORS.text : COLORS.inactive,
//               fontWeight: '400'
//             }}>
//               {value || field.placeholder}
//             </Text>
//             <Ionicons name="chevron-down" size={18} color={COLORS.inactive} />
//           </TouchableOpacity>
//         ) : (
//           <TextInput
//             value={value}
//             onChangeText={onChangeText}
//             placeholder={field.placeholder}
//             style={{
//               backgroundColor: COLORS.background,
//               borderWidth: 1,
//               borderColor: error ? COLORS.error : COLORS.border,
//               borderRadius: 12,
//               padding: 14,
//               fontSize: 15,
//               color: COLORS.text,
//               fontWeight: '400'
//             }}
//             placeholderTextColor={COLORS.inactive}
//           />
//         )}

//         {error && (
//           <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
//             <Ionicons name="alert-circle" size={14} color={COLORS.error} />
//             <Text style={{ color: COLORS.error, fontSize: 12, marginLeft: 4, fontWeight: '500' }}>
//               {error}
//             </Text>
//           </View>
//         )}

//         {showDropdown && selectedField === field._id && (
//           <View style={{
//             backgroundColor: COLORS.background,
//             borderWidth: 1,
//             borderColor: COLORS.border,
//             borderRadius: 12,
//             marginTop: 8,
//             maxHeight: 200,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.1,
//             shadowRadius: 8,
//             elevation: 4
//           }}>
//             <ScrollView showsVerticalScrollIndicator={false}>
//               {field.options?.map((option, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => {
//                     onChangeText(option)
//                     setShowDropdown(false)
//                     setSelectedField(null)
//                   }}
//                   style={{
//                     padding: 14,
//                     borderBottomWidth: index < field.options.length - 1 ? 1 : 0,
//                     borderBottomColor: COLORS.border,
//                     backgroundColor: value === option ? `${COLORS.primary}10` : 'transparent'
//                   }}
//                 >
//                   <Text style={{
//                     fontSize: 15,
//                     color: value === option ? COLORS.primary : COLORS.text,
//                     fontWeight: value === option ? '600' : '400'
//                   }}>{option}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}
//       </View>
//     )
//   }

//   // Professional Photo Grid Component
//   const renderPhotoGrid = () => (
//     <View style={{ marginBottom: 24 }}>
//       <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 12 }}>
//         Profile Photos
//       </Text>

//       <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
//         {photos.map((photo) => {
//           const isPrimary = photo.id === 1

//           return (
//             <View key={photo.id} style={{ width: (screenWidth - 60) / 2 }}>
//               <TouchableOpacity
//                 onPress={() => handlePhotoUpload(photo.id)}
//                 style={{
//                   aspectRatio: 1,
//                   borderRadius: 16,
//                   borderWidth: 1,
//                   borderColor: photo.url ? COLORS.primary : COLORS.border,
//                   backgroundColor: photo.url ? 'transparent' : COLORS.surface,
//                   overflow: 'hidden',
//                   position: 'relative'
//                 }}
//               >
//                 {photo.url ? (
//                   <>
//                     <Image source={{ uri: photo.url }} style={{ width: '100%', height: '100%' }} />
//                     {isPrimary && (
//                       <View style={{
//                         position: 'absolute',
//                         top: 8,
//                         left: 8,
//                         backgroundColor: COLORS.primary,
//                         paddingHorizontal: 8,
//                         paddingVertical: 4,
//                         borderRadius: 6
//                       }}>
//                         <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: '700' }}>
//                           PRIMARY
//                         </Text>
//                       </View>
//                     )}
//                     <TouchableOpacity
//                       onPress={(e) => {
//                         e.stopPropagation()
//                         handleDeletePhoto(photo.id)
//                       }}
//                       style={{
//                         position: 'absolute',
//                         top: 8,
//                         right: 8,
//                         backgroundColor: 'rgba(0,0,0,0.6)',
//                         width: 28,
//                         height: 28,
//                         borderRadius: 14,
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                       }}
//                     >
//                       <Ionicons name="close" size={16} color={COLORS.background} />
//                     </TouchableOpacity>
//                   </>
//                 ) : (
//                   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                     <Ionicons name="camera-outline" size={32} color={COLORS.inactive} />
//                     <Text style={{ 
//                       color: COLORS.inactive, 
//                       fontSize: 11, 
//                       marginTop: 8, 
//                       fontWeight: '500' 
//                     }}>
//                       {isPrimary ? "Main Photo" : `Photo ${photo.id}`}
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>
//           )
//         })}
//       </View>
//     </View>
//   )

//   // Professional Section Card
//   const SectionCard = () => {
//     const currentSection = formSections[currentSectionIndex]
    
//     if (!currentSection) return null

//     return (
//       <Reanimated.View
//         entering={FadeIn.duration(300)}
//         style={{
//           backgroundColor: COLORS.background,
//           borderRadius: 16,
//           padding: 24,
//           marginHorizontal: 24,
//           marginBottom: 24,
//           borderWidth: 1,
//           borderColor: COLORS.border,
//         }}
//       >
//         <View style={{ marginBottom: 24 }}>
//           <Text style={{ 
//             fontSize: 20, 
//             fontWeight: '700', 
//             color: COLORS.text,
//             letterSpacing: -0.3,
//             marginBottom: 8
//           }}>
//             {currentSection.label}
//           </Text>
//           <View style={{ height: 2, width: 40, backgroundColor: COLORS.primary, borderRadius: 1 }} />
//         </View>

//         {currentSection.fields?.map((field) => {
//           if (field.type === "photos") {
//             return <View key={field._id}>{renderPhotoGrid()}</View>
//           }
//           const value = formData?.[field.name] || ""
//           const errorMsg = fieldErrors?.[field.name]
//           return (
//             <View key={field._id}>
//               {renderInputField(field, value, (text) => handleInputChange(field.name, text, field), errorMsg)}
//             </View>
//           )
//         })}

//         {/* Navigation Footer */}
//         <View style={{ 
//           flexDirection: 'row', 
//           justifyContent: 'space-between',
//           marginTop: 8,
//           paddingTop: 24,
//           borderTopWidth: 1,
//           borderTopColor: COLORS.border
//         }}>
//           <TouchableOpacity
//             onPress={() => {
//               if (currentSectionIndex > 0) {
//                 setCurrentSectionIndex(currentSectionIndex - 1)
//                 scrollViewRef.current?.scrollTo({ y: 0, animated: true })
//               }
//             }}
//             disabled={currentSectionIndex === 0}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 10,
//               paddingHorizontal: 16,
//               borderRadius: 10,
//               opacity: currentSectionIndex === 0 ? 0.4 : 1
//             }}
//           >
//             <Ionicons name="chevron-back" size={18} color={COLORS.textSecondary} />
//             <Text style={{ marginLeft: 4, fontSize: 14, fontWeight: '600', color: COLORS.textSecondary }}>
//               Previous
//             </Text>
//           </TouchableOpacity>

//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//             {formSections.map((_, index) => (
//               <View
//                 key={index}
//                 style={{
//                   width: index === currentSectionIndex ? 20 : 6,
//                   height: 6,
//                   borderRadius: 3,
//                   backgroundColor: index === currentSectionIndex ? COLORS.primary : 
//                                  index < currentSectionIndex ? COLORS.success : COLORS.border
//                 }}
//               />
//             ))}
//           </View>

//           <TouchableOpacity
//             onPress={() => {
//               if (currentSectionIndex < formSections.length - 1) {
//                 setCurrentSectionIndex(currentSectionIndex + 1)
//                 scrollViewRef.current?.scrollTo({ y: 0, animated: true })
//               }
//             }}
//             disabled={currentSectionIndex === formSections.length - 1}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 10,
//               paddingHorizontal: 16,
//               borderRadius: 10,
//               opacity: currentSectionIndex === formSections.length - 1 ? 0.4 : 1
//             }}
//           >
//             <Text style={{ marginRight: 4, fontSize: 14, fontWeight: '600', color: COLORS.textSecondary }}>
//               Next
//             </Text>
//             <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary} />
//           </TouchableOpacity>
//         </View>
//       </Reanimated.View>
//     )
//   }

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//         <Text style={{ marginTop: 16, fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' }}>
//           Loading profile...
//         </Text>
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ProfileHeader />
        
//         <ScrollView 
//           ref={scrollViewRef}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
//         >
//           <SectionCard />
//         </ScrollView>
//       </KeyboardAvoidingView>

//       <Toast />
//     </SafeAreaView>
//   )
// }

// export default ProfileScreen
// "use client"

// import { useState, useEffect, useRef } from "react"
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   TextInput,
//   Image,
//   Modal,
//   Dimensions,
//   ScrollView,
//   StatusBar,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native"
// import { useSession } from "context/SessionContext"
// import { Ionicons } from "@expo/vector-icons"
// import { LinearGradient } from "expo-linear-gradient"
// import Reanimated, { FadeIn, FadeInDown, SlideInRight } from "react-native-reanimated"
// import * as ImagePicker from "expo-image-picker"
// import Toast from "react-native-toast-message"

// const { width: screenWidth } = Dimensions.get("window")

// // Enhanced Color Palette - Red Theme with more vibrancy
// const COLORS = {
//   primary: "#f87171",
//   primaryDark: "#dc2626",
//   primaryLight: "#fca5a5",
//   primaryGhost: "#fef2f2",
//   inactive: "#94A3B8",
//   inactiveLight: "#E2E8F0",
//   background: "#ffffff",
//   surface: "#fafafa",
//   border: "#e5e7eb",
//   text: "#111827",
//   textSecondary: "#6b7280",
//   textLight: "#9ca3af",
//   success: "#10b981",
//   successLight: "#d1fae5",
//   warning: "#f59e0b",
//   error: "#ef4444",
//   gradient: ["#f87171", "#dc2626"],
//   gradientLight: ["#fef2f2", "#fee2e2"],
// }

// const ProfileScreen = () => {
//   const { user } = useSession()
//   const [formSections, setFormSections] = useState([])
//   const [formData, setFormData] = useState({})
//   const [isLoading, setIsLoading] = useState(true)
//   const [isSaving, setIsSaving] = useState(false)
//   const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
//   const [profileCompletion, setProfileCompletion] = useState(0)
//   const [showSectionModal, setShowSectionModal] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [selectedField, setSelectedField] = useState(null)
//   const [focusedField, setFocusedField] = useState(null)
//   const [photos, setPhotos] = useState([
//     { id: 1, url: null, isPrimary: true },
//     { id: 2, url: null, isPrimary: false },
//     { id: 3, url: null, isPrimary: false },
//     { id: 4, url: null, isPrimary: false },
//   ])
//   const [fieldErrors, setFieldErrors] = useState({})
//   const scrollViewRef = useRef(null)

//   const fieldNameMappings = {
//     "Full Name": "name",
//     "Height": "height",
//     "Weight": "weight",
//     "Date of Birth": "dob",
//     "Marital Status": "maritalStatus",
//     "Mother Tongue": "motherTongue",
//     "Current City": "currentCity",
//     "Email Address": "email",
//     "Permanent Address": "permanentAddress",
//     "Gender": "gender",
//     "Blood Group": "bloodGroup",
//     "Complexion": "complexion",
//     "Highest Education": "education",
//     "Occupation": "occupation",
//     "Field of Study": "fieldOfStudy",
//     "Company": "company",
//     "College/University": "college",
//     "Annual Income": "income",
//     "Father's Name": "fatherName",
//     "Mother's Name": "mother",
//     "Religion": "religion",
//     "Sub Caste": "subCaste",
//     "Caste": "caste",
//     "Gothra": "gothra",
//   }

//   const getSectionIcon = (label) => {
//     const iconMap = {
//       'Personal': 'person',
//       'Education': 'school',
//       'Professional': 'briefcase',
//       'Family': 'people',
//       'Religious': 'moon',
//       'Photos': 'images',
//       'Preferences': 'heart',
//       'Contact': 'call',
//     }
//     return iconMap[label] || 'document-text'
//   }

//   const normalizeFieldName = (name) => {
//     return name.toLowerCase().replace(/[^a-z0-9]/g, "")
//   }

//   useEffect(() => {
//     const loadData = async () => {
//       if (!user?.id) {
//         Alert.alert("Error", "User not authenticated")
//         setIsLoading(false)
//         return
//       }

//       try {
//         const sectionsRes = await fetch("https://shiv-bandhan-testing.vercel.app/api/admin/form-sections")
//         if (!sectionsRes.ok) throw new Error("Failed to fetch form sections")
//         const sectionsData = await sectionsRes.json()

//         const transformedSections = sectionsData.map((section) => ({
//           ...section,
//           id: section._id,
//           fields: section.fields.map((field) => ({
//             ...field,
//             name: field.name,
//             label: field.label,
//             type: field.type,
//             required: field.required,
//             options: field.options || [],
//             placeholder: field.placeholder || "",
//           })),
//         }))

//         setFormSections(transformedSections)

//         const userRes = await fetch(`https://shiv-bandhan-testing.vercel.app/api/users/${user.id}`)
//         if (!userRes.ok) throw new Error("Failed to fetch user data")
//         const userData = await userRes.json()

//         const initialFormData = {}
//         transformedSections.forEach((section) => {
//           section.fields.forEach((field) => {
//             const mappingEntry = Object.entries(fieldNameMappings).find(
//               ([key]) => normalizeFieldName(key) === normalizeFieldName(field.name),
//             )
//             if (mappingEntry) {
//               const [_, backendField] = mappingEntry
//               if (userData[backendField] !== undefined) {
//                 initialFormData[field.name] = userData[backendField]
//               }
//             }
//           })
//         })

//         setFormData(initialFormData)
        
//         if (userData.profilePhoto) {
//           setPhotos((prevPhotos) =>
//             prevPhotos.map((photo) => (photo.id === 1 ? { ...photo, url: userData.profilePhoto } : photo)),
//           )
//         }

//       } catch (error) {
//         console.error("Error loading data:", error)
//         Alert.alert("Error", `Failed to load profile: ${error.message}`)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     loadData()
//   }, [user])

//   useEffect(() => {
//     if (Object.keys(formData).length > 0 && formSections.length > 0) {
//       setProfileCompletion(calculateProfileCompletion())
//     }
//   }, [formData, formSections])

//   const calculateProfileCompletion = () => {
//     if (!formSections.length) return 0

//     const requiredFields = Object.keys(fieldNameMappings)
//     let totalFields = requiredFields.length
//     let filledFields = 0

//     requiredFields.forEach((fieldName) => {
//       const value = formData[fieldName]
//       if (value !== undefined && value !== null && value !== "") {
//         filledFields++
//       }
//     })

//     totalFields++
//     if (formData.profilePhoto || (photos[0] && photos[0].url)) {
//       filledFields++
//     }

//     return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0
//   }

//   const validateField = (field, value) => {
//     if (field.required && (value === undefined || value === "" || value === null)) {
//       return `${field.label} is required`
//     }
//     return ""
//   }

//   const handleInputChange = (fieldName, value, field) => {
//     setFormData((prev) => ({ ...prev, [fieldName]: value }))
//     if (field) {
//       const error = validateField(field, value)
//       setFieldErrors((prev) => ({ ...prev, [fieldName]: error }))
//     }
//     setShowDropdown(false)
//   }

//   const handleProfileUpdate = async () => {
//     setIsSaving(true)
//     try {
//       const errors = {}
//       formSections.forEach((section) => {
//         section.fields.forEach((field) => {
//           const error = validateField(field, formData[field.name])
//           if (error) errors[field.name] = error
//         })
//       })

//       if (Object.keys(errors).length > 0) {
//         setFieldErrors(errors)
//         Toast.show({
//           type: "error",
//           text1: "Missing Fields",
//           text2: "Please fill all required fields",
//           position: "bottom",
//         })
//         setIsSaving(false)
//         return
//       }

//       const transformedData = {}
//       Object.entries(fieldNameMappings).forEach(([displayName, backendField]) => {
//         if (formData[displayName] !== undefined) {
//           transformedData[backendField] = formData[displayName]
//         }
//       })

//       const payload = {
//         ...transformedData,
//         userId: user?.id,
//         profilePhoto: photos[0]?.url,
//       }

//       const response = await fetch("https://shiv-bandhan-testing.vercel.app/api/users/update", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       })

//       if (!response.ok) throw new Error("Failed to update profile")

//       Toast.show({
//         type: "success",
//         text1: "Profile Updated",
//         text2: "Your changes have been saved",
//         position: "bottom",
//       })

//     } catch (error) {
//       console.error("Error updating profile:", error)
//       Toast.show({
//         type: "error",
//         text1: "Update Failed",
//         text2: error.message,
//         position: "bottom",
//       })
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handlePhotoUpload = async (photoId) => {
//     try {
//       const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
//       if (!permission.granted) {
//         Alert.alert("Permission Denied", "Please allow access to your photo library")
//         return
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       })

//       if (!result.canceled) {
//         const formDataUpload = new FormData()
//         formDataUpload.append("file", {
//           uri: result.assets[0].uri,
//           type: "image/jpeg",
//           name: `photo-${photoId}.jpg`,
//         })
//         formDataUpload.append("upload_preset", "shivbandhan")

//         const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dqfum2awz/image/upload", {
//           method: "POST",
//           body: formDataUpload,
//         })

//         const uploadResult = await uploadResponse.json()
//         if (uploadResult.secure_url) {
//           setPhotos((prev) =>
//             prev.map((photo) => (photo.id === photoId ? { ...photo, url: uploadResult.secure_url } : photo)),
//           )
//           if (photoId === 1) {
//             handleInputChange("profilePhoto", uploadResult.secure_url)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error uploading photo:", error)
//       Alert.alert("Error", "Failed to upload photo")
//     }
//   }

//   const handleDeletePhoto = (photoId) => {
//     setPhotos((prevPhotos) => prevPhotos.map((photo) => (photo.id === photoId ? { ...photo, url: null } : photo)))
//     if (photoId === 1) {
//       handleInputChange("profilePhoto", null)
//     }
//   }

//   // Enhanced Gradient Header with Stats
//   const ProfileHeader = () => (
//     <LinearGradient 
//       colors={COLORS.gradient}
//       style={{
//         paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20,
//         paddingBottom: 24,
//         paddingHorizontal: 24,
//         borderBottomLeftRadius: 24,
//         borderBottomRightRadius: 24,
//         shadowColor: COLORS.primaryDark,
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.3,
//         shadowRadius: 12,
//         elevation: 8,
//       }}
//     >
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//         <View style={{ flex: 1 }}>
//           <Text style={{ 
//             fontSize: 28, 
//             fontWeight: '900', 
//             color: COLORS.background,
//             letterSpacing: -0.8,
//             marginBottom: 6
//           }}>
//             Edit Profile
//           </Text>
//           <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
//             {profileCompletion < 50 ? "Let's complete your profile" : 
//              profileCompletion < 80 ? "You're doing great!" : "Almost perfect!"}
//           </Text>
//         </View>
        
//         <TouchableOpacity 
//           onPress={handleProfileUpdate}
//           disabled={isSaving}
//           style={{
//             backgroundColor: COLORS.background,
//             paddingHorizontal: 24,
//             paddingVertical: 12,
//             borderRadius: 16,
//             shadowColor: '#000',
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 4,
//             elevation: 3,
//             flexDirection: 'row',
//             alignItems: 'center',
//             gap: 6
//           }}
//         >
//           {isSaving ? (
//             <ActivityIndicator size="small" color={COLORS.primary} />
//           ) : (
//             <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
//           )}
//           <Text style={{ color: COLORS.primary, fontSize: 14, fontWeight: '700' }}>
//             {isSaving ? 'Saving' : 'Save'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Enhanced Progress with Animation */}
//       <View style={{ marginBottom: 20 }}>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//             <View style={{
//               backgroundColor: 'rgba(255,255,255,0.2)',
//               paddingHorizontal: 10,
//               paddingVertical: 4,
//               borderRadius: 10
//             }}>
//               <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.background }}>
//                 {profileCompletion}%
//               </Text>
//             </View>
//             <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
//               Complete
//             </Text>
//           </View>
//           <Text style={{ fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>
//             Section {currentSectionIndex + 1} of {formSections.length}
//           </Text>
//         </View>
//         <View style={{
//           height: 8,
//           backgroundColor: 'rgba(255,255,255,0.2)',
//           borderRadius: 4,
//           overflow: 'hidden'
//         }}>
//           <LinearGradient
//             colors={['#ffffff', 'rgba(255,255,255,0.9)']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={{
//               width: `${profileCompletion}%`,
//               height: '100%',
//               borderRadius: 4,
//             }}
//           />
//         </View>
//       </View>

//       {/* Colorful Section Navigation */}
//       <ScrollView 
//         horizontal 
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={{ gap: 10 }}
//       >
//         {formSections.map((section, index) => {
//           const isActive = currentSectionIndex === index
//           const isCompleted = index < currentSectionIndex
          
//           return (
//             <TouchableOpacity
//               key={section._id}
//               onPress={() => {
//                 setCurrentSectionIndex(index)
//                 scrollViewRef.current?.scrollTo({ y: 0, animated: true })
//               }}
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 paddingHorizontal: 16,
//                 paddingVertical: 10,
//                 borderRadius: 16,
//                 backgroundColor: isActive ? COLORS.background : 'rgba(255,255,255,0.15)',
//                 borderWidth: isActive ? 0 : 1,
//                 borderColor: 'rgba(255,255,255,0.3)',
//                 gap: 8,
//                 shadowColor: isActive ? '#000' : 'transparent',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 4,
//                 elevation: isActive ? 3 : 0,
//               }}
//             >
//               <View style={{
//                 width: 28,
//                 height: 28,
//                 borderRadius: 14,
//                 backgroundColor: isActive ? COLORS.primaryGhost : 
//                                isCompleted ? COLORS.successLight : 'rgba(255,255,255,0.2)',
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}>
//                 {isCompleted ? (
//                   <Ionicons name="checkmark" size={14} color={COLORS.success} />
//                 ) : (
//                   <Ionicons 
//                     name={getSectionIcon(section.label)} 
//                     size={14} 
//                     color={isActive ? COLORS.primary : COLORS.background} 
//                   />
//                 )}
//               </View>
//               <Text style={{
//                 fontSize: 13,
//                 fontWeight: '700',
//                 color: isActive ? COLORS.primary : COLORS.background,
//                 letterSpacing: 0.2
//               }}>
//                 {section.label}
//               </Text>
//             </TouchableOpacity>
//           )
//         })}
//       </ScrollView>
//     </LinearGradient>
//   )

//   // Enhanced Input Field with Interactive States
//   const renderInputField = (field, value, onChangeText, error) => {
//     const isFocused = focusedField === field._id
//     const hasValue = value && value !== ""

//     return (
//       <View style={{ marginBottom: 20 }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 6 }}>
//           <Text style={{
//             fontSize: 14,
//             fontWeight: '700',
//             color: isFocused ? COLORS.primary : COLORS.text,
//             letterSpacing: 0.2
//           }}>
//             {field.label}
//           </Text>
//           {field.required && (
//             <View style={{
//               backgroundColor: COLORS.error + '15',
//               paddingHorizontal: 6,
//               paddingVertical: 2,
//               borderRadius: 6
//             }}>
//               <Text style={{ color: COLORS.error, fontSize: 10, fontWeight: '700' }}>REQUIRED</Text>
//             </View>
//           )}
//           {hasValue && !error && (
//             <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
//           )}
//         </View>

//         {field.type === "textarea" ? (
//           <View style={{
//             borderRadius: 16,
//             borderWidth: 2,
//             borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.border,
//             backgroundColor: isFocused ? COLORS.primaryGhost : COLORS.background,
//             overflow: 'hidden'
//           }}>
//             <TextInput
//               value={value}
//               onChangeText={onChangeText}
//               onFocus={() => setFocusedField(field._id)}
//               onBlur={() => setFocusedField(null)}
//               placeholder={field.placeholder}
//               multiline
//               numberOfLines={4}
//               style={{
//                 padding: 16,
//                 fontSize: 15,
//                 color: COLORS.text,
//                 minHeight: 100,
//                 textAlignVertical: 'top',
//                 fontWeight: '400'
//               }}
//               placeholderTextColor={COLORS.textLight}
//             />
//           </View>
//         ) : field.type === "select" ? (
//           <View>
//             <TouchableOpacity
//               onPress={() => {
//                 setSelectedField(field._id)
//                 setShowDropdown(!showDropdown)
//               }}
//               style={{
//                 backgroundColor: showDropdown && selectedField === field._id ? COLORS.primaryGhost : COLORS.background,
//                 borderWidth: 2,
//                 borderColor: error ? COLORS.error : showDropdown && selectedField === field._id ? COLORS.primary : COLORS.border,
//                 borderRadius: 16,
//                 padding: 16,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center'
//               }}
//             >
//               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
//                 {hasValue && (
//                   <View style={{
//                     backgroundColor: COLORS.primaryLight + '30',
//                     width: 8,
//                     height: 8,
//                     borderRadius: 4
//                   }} />
//                 )}
//                 <Text style={{ 
//                   fontSize: 15, 
//                   color: value ? COLORS.text : COLORS.textLight,
//                   fontWeight: hasValue ? '600' : '400',
//                   flex: 1
//                 }}>
//                   {value || field.placeholder}
//                 </Text>
//               </View>
//               <Ionicons 
//                 name={showDropdown && selectedField === field._id ? "chevron-up" : "chevron-down"} 
//                 size={20} 
//                 color={COLORS.primary} 
//               />
//             </TouchableOpacity>

//             {showDropdown && selectedField === field._id && (
//               <Reanimated.View
//                 entering={SlideInRight.duration(200)}
//                 style={{
//                   backgroundColor: COLORS.background,
//                   borderWidth: 2,
//                   borderColor: COLORS.primary + '30',
//                   borderRadius: 16,
//                   marginTop: 8,
//                   maxHeight: 240,
//                   shadowColor: COLORS.primary,
//                   shadowOffset: { width: 0, height: 8 },
//                   shadowOpacity: 0.15,
//                   shadowRadius: 12,
//                   elevation: 8,
//                   overflow: 'hidden'
//                 }}
//               >
//                 <ScrollView showsVerticalScrollIndicator={false}>
//                   {field.options?.map((option, index) => {
//                     const isSelected = value === option
//                     return (
//                       <TouchableOpacity
//                         key={index}
//                         onPress={() => {
//                           onChangeText(option)
//                           setShowDropdown(false)
//                           setSelectedField(null)
//                         }}
//                         style={{
//                           padding: 16,
//                           borderBottomWidth: index < field.options.length - 1 ? 1 : 0,
//                           borderBottomColor: COLORS.border,
//                           backgroundColor: isSelected ? COLORS.primaryGhost : 'transparent',
//                           flexDirection: 'row',
//                           alignItems: 'center',
//                           justifyContent: 'space-between'
//                         }}
//                       >
//                         <Text style={{
//                           fontSize: 15,
//                           color: isSelected ? COLORS.primary : COLORS.text,
//                           fontWeight: isSelected ? '700' : '400',
//                           flex: 1
//                         }}>{option}</Text>
//                         {isSelected && (
//                           <View style={{
//                             backgroundColor: COLORS.primary,
//                             width: 20,
//                             height: 20,
//                             borderRadius: 10,
//                             alignItems: 'center',
//                             justifyContent: 'center'
//                           }}>
//                             <Ionicons name="checkmark" size={12} color={COLORS.background} />
//                           </View>
//                         )}
//                       </TouchableOpacity>
//                     )
//                   })}
//                 </ScrollView>
//               </Reanimated.View>
//             )}
//           </View>
//         ) : (
//           <View style={{
//             borderRadius: 16,
//             borderWidth: 2,
//             borderColor: error ? COLORS.error : isFocused ? COLORS.primary : COLORS.border,
//             backgroundColor: isFocused ? COLORS.primaryGhost : COLORS.background,
//             overflow: 'hidden'
//           }}>
//             <TextInput
//               value={value}
//               onChangeText={onChangeText}
//               onFocus={() => setFocusedField(field._id)}
//               onBlur={() => setFocusedField(null)}
//               placeholder={field.placeholder}
//               style={{
//                 padding: 16,
//                 fontSize: 15,
//                 color: COLORS.text,
//                 fontWeight: '400'
//               }}
//               placeholderTextColor={COLORS.textLight}
//             />
//           </View>
//         )}

//         {error && (
//           <Reanimated.View 
//             entering={FadeInDown.duration(200)}
//             style={{ 
//               flexDirection: 'row', 
//               alignItems: 'center', 
//               marginTop: 8,
//               backgroundColor: COLORS.error + '10',
//               padding: 10,
//               borderRadius: 10,
//               gap: 8
//             }}
//           >
//             <Ionicons name="alert-circle" size={16} color={COLORS.error} />
//             <Text style={{ color: COLORS.error, fontSize: 12, fontWeight: '600', flex: 1 }}>
//               {error}
//             </Text>
//           </Reanimated.View>
//         )}
//       </View>
//     )
//   }

//   // Enhanced Photo Grid
//   const renderPhotoGrid = () => (
//     <View style={{ marginBottom: 24 }}>
//       <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//           <View style={{
//             backgroundColor: COLORS.primaryLight + '30',
//             width: 32,
//             height: 32,
//             borderRadius: 16,
//             alignItems: 'center',
//             justifyContent: 'center'
//           }}>
//             <Ionicons name="images" size={16} color={COLORS.primary} />
//           </View>
//           <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>
//             Profile Photos
//           </Text>
//         </View>
//         <View style={{
//           backgroundColor: COLORS.warning + '15',
//           paddingHorizontal: 10,
//           paddingVertical: 4,
//           borderRadius: 8
//         }}>
//           <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.warning }}>
//             {photos.filter(p => p.url).length}/4
//           </Text>
//         </View>
//       </View>

//       <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
//         {photos.map((photo) => {
//           const isPrimary = photo.id === 1

//           return (
//             <View key={photo.id} style={{ width: (screenWidth - 60) / 2 }}>
//               <TouchableOpacity
//                 onPress={() => handlePhotoUpload(photo.id)}
//                 style={{
//                   aspectRatio: 1,
//                   borderRadius: 20,
//                   borderWidth: 2,
//                   borderColor: photo.url ? COLORS.primary : COLORS.inactiveLight,
//                   backgroundColor: photo.url ? 'transparent' : COLORS.primaryGhost,
//                   overflow: 'hidden',
//                   position: 'relative'
//                 }}
//               >
//                 {photo.url ? (
//                   <>
//                     <Image source={{ uri: photo.url }} style={{ width: '100%', height: '100%' }} />
//                     <LinearGradient
//                       colors={['transparent', 'rgba(0,0,0,0.5)']}
//                       style={{
//                         position: 'absolute',
//                         bottom: 0,
//                         left: 0,
//                         right: 0,
//                         height: '40%'
//                       }}
//                     />
//                     {isPrimary && (
//                       <LinearGradient
//                         colors={COLORS.gradient}
//                         style={{
//                           position: 'absolute',
//                           top: 10,
//                           left: 10,
//                           paddingHorizontal: 10,
//                           paddingVertical: 5,
//                           borderRadius: 8,
//                           flexDirection: 'row',
//                           alignItems: 'center',
//                           gap: 4
//                         }}
//                       >
//                         <Ionicons name="star" size={10} color={COLORS.background} />
//                         <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: '800' }}>
//                           PRIMARY
//                         </Text>
//                       </LinearGradient>
//                     )}
//                     <TouchableOpacity
//                       onPress={(e) => {
//                         e.stopPropagation()
//                         handleDeletePhoto(photo.id)
//                       }}
//                       style={{
//                         position: 'absolute',
//                         top: 10,
//                         right: 10,
//                         backgroundColor: 'rgba(239, 68, 68, 0.9)',
//                         width: 32,
//                         height: 32,
//                         borderRadius: 16,
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         borderWidth: 2,
//                         borderColor: COLORS.background
//                       }}
//                     >
//                       <Ionicons name="trash" size={14} color={COLORS.background} />
//                     </TouchableOpacity>
//                   </>
//                 ) : (
//                   <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
//                     <View style={{
//                       backgroundColor: COLORS.primary + '20',
//                       width: 48,
//                       height: 48,
//                       borderRadius: 24,
//                       alignItems: 'center',
//                       justifyContent: 'center'
//                     }}>
//                       <Ionicons name="camera" size={24} color={COLORS.primary} />
//                     </View>
//                     <Text style={{ 
//                       color: COLORS.textSecondary, 
//                       fontSize: 11, 
//                       fontWeight: '600',
//                       textAlign: 'center'
//                     }}>
//                       {isPrimary ? "Main Photo" : `Photo ${photo.id}`}
//                     </Text>
//                   </View>
//                 )}
//               </TouchableOpacity>
//             </View>
//           )
//         })}
//       </View>
//     </View>
//   )

//   // Enhanced Section Card with Better Visual Hierarchy
//   const SectionCard = () => {
//     const currentSection = formSections[currentSectionIndex]
    
//     if (!currentSection) return null

//     return (
//       <Reanimated.View
//         entering={FadeIn.duration(400)}
//         style={{
//           backgroundColor: COLORS.background,
//           borderRadius: 24,
//           padding: 24,
//           marginHorizontal: 24,
//           marginBottom: 24,
//           shadowColor: COLORS.primary,
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.08,
//           shadowRadius: 12,
//           elevation: 4,
//           borderWidth: 1,
//           borderColor: COLORS.border,
//         }}
//       >
//         {/* Section Header with Icon */}
//         <View style={{ marginBottom: 28 }}>
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
//             <LinearGradient
//               colors={COLORS.gradient}
//               style={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 16,
//                 alignItems: 'center',
//                 justifyContent: 'center'
//               }}
//             >
//               <Ionicons name={getSectionIcon(currentSection.label)} size={24} color={COLORS.background} />
//             </LinearGradient>
//             <View style={{ flex: 1 }}>
//               <Text style={{ 
//                 fontSize: 22, 
//                 fontWeight: '800', 
//                 color: COLORS.text,
//                 letterSpacing: -0.5
//               }}>
//                 {currentSection.label}
//               </Text>
//               <Text style={{ 
//                 fontSize: 12, 
//                 color: COLORS.textSecondary,
//                 fontWeight: '500',
//                 marginTop: 2
//               }}>
//                 Fill in your details below
//               </Text>
//             </View>
//           </View>
//           <View style={{ height: 3, width: 60, backgroundColor: COLORS.primary, borderRadius: 2 }} />
//         </View>

//         {/* Fields */}
//         {currentSection.fields?.map((field) => {
//           if (field.type === "photos") {
//             return <View key={field._id}>{renderPhotoGrid()}</View>
//           }
//           const value = formData?.[field.name] || ""
//           const errorMsg = fieldErrors?.[field.name]
//           return (
//             <View key={field._id}>
//               {renderInputField(field, value, (text) => handleInputChange(field.name, text, field), errorMsg)}
//             </View>
//           )
//         })}

//         {/* Enhanced Navigation Footer */}
//         <View style={{ 
//           flexDirection: 'row', 
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginTop: 16,
//           paddingTop: 24,
//           borderTopWidth: 2,
//           borderTopColor: COLORS.border
//         }}>
//           <TouchableOpacity
//             onPress={() => {
//               if (currentSectionIndex > 0) {
//                 setCurrentSectionIndex(currentSectionIndex - 1)
//                 scrollViewRef.current?.scrollTo({ y: 0, animated: true })
//               }
//             }}
//             disabled={currentSectionIndex === 0}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 12,
//               paddingHorizontal: 20,
//               borderRadius: 14,
//               backgroundColor: currentSectionIndex === 0 ? COLORS.surface : COLORS.primaryGhost,
//               opacity: currentSectionIndex === 0 ? 0.5 : 1,
//               borderWidth: 1,
//               borderColor: currentSectionIndex === 0 ? COLORS.border : COLORS.primaryLight
//             }}
//           >
//             <Ionicons 
//               name="chevron-back" 
//               size={18} 
//               color={currentSectionIndex === 0 ? COLORS.inactive : COLORS.primary} 
//             />
//             <Text style={{ 
//               marginLeft: 6, 
//               fontSize: 14, 
//               fontWeight: '700', 
//               color: currentSectionIndex === 0 ? COLORS.inactive : COLORS.primary 
//             }}>
//               Previous
//             </Text>
//           </TouchableOpacity>

//           {/* Progress Dots */}
//           <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//             {formSections.map((_, index) => (
//               <View
//                 key={index}
//                 style={{
//                   width: index === currentSectionIndex ? 24 : 8,
//                   height: 8,
//                   borderRadius: 4,
//                   backgroundColor: index === currentSectionIndex ? COLORS.primary : 
//                                  index < currentSectionIndex ? COLORS.success : COLORS.inactiveLight
//                 }}
//               />
//             ))}
//           </View>

//           <TouchableOpacity
//             onPress={() => {
//               if (currentSectionIndex < formSections.length - 1) {
//                 setCurrentSectionIndex(currentSectionIndex + 1)
//                 scrollViewRef.current?.scrollTo({ y: 0, animated: true })
//               }
//             }}
//             disabled={currentSectionIndex === formSections.length - 1}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 12,
//               paddingHorizontal: 20,
//               borderRadius: 14,
//               opacity: currentSectionIndex === formSections.length - 1 ? 0.5 : 1
//             }}
//           >
//             <LinearGradient
//               colors={currentSectionIndex === formSections.length - 1 ? [COLORS.surface, COLORS.surface] : COLORS.gradient}
//               style={{
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 bottom: 0,
//                 borderRadius: 14
//               }}
//             />
//             <Text style={{ 
//               marginRight: 6, 
//               fontSize: 14, 
//               fontWeight: '700', 
//               color: currentSectionIndex === formSections.length - 1 ? COLORS.inactive : COLORS.background,
//               zIndex: 1
//             }}>
//               Next
//             </Text>
//             <Ionicons 
//               name="chevron-forward" 
//               size={18} 
//               color={currentSectionIndex === formSections.length - 1 ? COLORS.inactive : COLORS.background}
//               style={{ zIndex: 1 }}
//             />
//           </TouchableOpacity>
//         </View>
//       </Reanimated.View>
//     )
//   }

//   if (isLoading) {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
//         <View style={{
//           backgroundColor: COLORS.primaryGhost,
//           padding: 32,
//           borderRadius: 24,
//           alignItems: 'center',
//           gap: 16
//         }}>
//           <ActivityIndicator size="large" color={COLORS.primary} />
//           <Text style={{ fontSize: 16, color: COLORS.text, fontWeight: '600' }}>
//             Loading profile...
//           </Text>
//         </View>
//       </View>
//     )
//   }

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
//       <KeyboardAvoidingView 
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ProfileHeader />
        
//         <ScrollView 
//           ref={scrollViewRef}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}
//         >
//           <SectionCard />
//         </ScrollView>
//       </KeyboardAvoidingView>

//       <Toast />
//     </SafeAreaView>
//   )
// }

// export default ProfileScreen
"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"
import { useSession } from "context/SessionContext"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Reanimated, { FadeIn, FadeInDown } from "react-native-reanimated"
import * as ImagePicker from "expo-image-picker"
import Toast from "react-native-toast-message"

const { width: screenWidth } = Dimensions.get("window")

const COLORS = {
  primary: "#f87171",
  primaryDark: "#dc2626",
  primaryLight: "#fca5a5",
  inactive: "#94A3B8",
  background: "#ffffff",
  surface: "#fafafa",
  border: "#e5e7eb",
  text: "#111827",
  textSecondary: "#6b7280",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
}

const BASE_URL = "https://shiv-bandhan-testing.vercel.app/"

const ProfileScreen = () => {
  const { user } = useSession()
  const [formSections, setFormSections] = useState([])
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [profileCompletion, setProfileCompletion] = useState(0)
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

  const getSectionIcon = (label) => {
    const iconMap = {
      'Personal': 'person',
      'Education': 'school',
      'Professional': 'briefcase',
      'Family': 'people',
      'Religious': 'moon',
      'Photos': 'images',
      'Preferences': 'heart',
      'Contact': 'call',
    }
    return iconMap[label] || 'document-text'
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
        const sectionsRes = await fetch(`${BASE_URL}api/admin/form-sections`)
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

        const userRes = await fetch(`${BASE_URL}api/users/${user.id}`)
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

      const response = await fetch(`${BASE_URL}api/users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your changes have been saved",
      })

    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message,
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
      Alert.alert("Error", "Failed to upload photo")
    }
  }

  const handleDeletePhoto = (photoId) => {
    setPhotos((prevPhotos) => prevPhotos.map((photo) => (photo.id === photoId ? { ...photo, url: null } : photo)))
    if (photoId === 1) {
      handleInputChange("profilePhoto", null)
    }
  }

  const ProfileHeader = () => (
    <LinearGradient 
      colors={[COLORS.primary, COLORS.primaryDark]}
      style={{
        paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 20,
        paddingBottom: 24,
        paddingHorizontal: 24,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 26, 
            fontWeight: '700', 
            color: COLORS.background,
            marginBottom: 4
          }}>
            Edit Profile
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
            Complete your profile to get better matches
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleProfileUpdate}
          disabled={isSaving}
          style={{
            backgroundColor: COLORS.background,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6
          }}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Ionicons name="checkmark" size={16} color={COLORS.primary} />
          )}
          <Text style={{ color: COLORS.primary, fontSize: 14, fontWeight: '600' }}>
            {isSaving ? 'Saving' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
            {profileCompletion}% Complete
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
            {currentSectionIndex + 1}/{formSections.length}
          </Text>
        </View>
        <View style={{
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <View
            style={{
              width: `${profileCompletion}%`,
              height: '100%',
              backgroundColor: COLORS.background,
              borderRadius: 3,
            }}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {formSections.map((section, index) => (
          <TouchableOpacity
            key={section._id}
            onPress={() => {
              setCurrentSectionIndex(index)
              scrollViewRef.current?.scrollTo({ y: 0, animated: true })
            }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 10,
              backgroundColor: currentSectionIndex === index ? COLORS.background : 'rgba(255,255,255,0.2)',
              borderWidth: 1,
              borderColor: currentSectionIndex === index ? 'transparent' : 'rgba(255,255,255,0.3)',
            }}
          >
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: currentSectionIndex === index ? COLORS.primary : COLORS.background,
            }}>
              {section.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  )

  const renderInputField = (field, value, onChangeText, error) => {
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={{
          fontSize: 13,
          fontWeight: '600',
          color: COLORS.text,
          marginBottom: 8,
        }}>
          {field.label} {field.required && <Text style={{ color: COLORS.error }}>*</Text>}
        </Text>

        {field.type === "textarea" ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            multiline
            numberOfLines={4}
            style={{
              padding: 12,
              fontSize: 15,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: error ? COLORS.error : COLORS.border,
              minHeight: 100,
              textAlignVertical: 'top',
            }}
            placeholderTextColor={COLORS.textSecondary}
          />
        ) : field.type === "select" ? (
          <View>
            <TouchableOpacity
              onPress={() => {
                setSelectedField(field._id)
                setShowDropdown(!showDropdown)
              }}
              style={{
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: error ? COLORS.error : COLORS.border,
                borderRadius: 10,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Text style={{ 
                fontSize: 15, 
                color: value ? COLORS.text : COLORS.textSecondary,
              }}>
                {value || field.placeholder}
              </Text>
              <Ionicons 
                name={showDropdown && selectedField === field._id ? "chevron-up" : "chevron-down"} 
                size={18} 
                color={COLORS.primary} 
              />
            </TouchableOpacity>

            {showDropdown && selectedField === field._id && (
              <View
                style={{
                  backgroundColor: COLORS.background,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 10,
                  marginTop: 8,
                  maxHeight: 200,
                  overflow: 'hidden'
                }}
              >
                <ScrollView>
                  {field.options?.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        onChangeText(option)
                        setShowDropdown(false)
                        setSelectedField(null)
                      }}
                      style={{
                        padding: 12,
                        borderBottomWidth: index < field.options.length - 1 ? 1 : 0,
                        borderBottomColor: COLORS.border,
                        backgroundColor: value === option ? COLORS.surface : 'transparent',
                      }}
                    >
                      <Text style={{
                        fontSize: 15,
                        color: value === option ? COLORS.primary : COLORS.text,
                        fontWeight: value === option ? '600' : '400',
                      }}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        ) : (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={field.placeholder}
            style={{
              padding: 12,
              fontSize: 15,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: error ? COLORS.error : COLORS.border,
            }}
            placeholderTextColor={COLORS.textSecondary}
          />
        )}

        {error && (
          <Text style={{ color: COLORS.error, fontSize: 12, marginTop: 4 }}>
            {error}
          </Text>
        )}
      </View>
    )
  }

  const renderPhotoGrid = () => (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 12 }}>
        Profile Photos ({photos.filter(p => p.url).length}/4)
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {photos.map((photo) => (
          <View key={photo.id} style={{ width: (screenWidth - 60) / 2 }}>
            <TouchableOpacity
              onPress={() => handlePhotoUpload(photo.id)}
              style={{
                aspectRatio: 1,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: photo.url ? COLORS.primary : COLORS.border,
                backgroundColor: photo.url ? 'transparent' : COLORS.surface,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {photo.url ? (
                <>
                  <Image source={{ uri: photo.url }} style={{ width: '100%', height: '100%' }} />
                  {photo.id === 1 && (
                    <View style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: COLORS.primary,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}>
                      <Text style={{ color: COLORS.background, fontSize: 10, fontWeight: '600' }}>
                        PRIMARY
                      </Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation()
                      handleDeletePhoto(photo.id)
                    }}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: COLORS.error,
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="trash" size={14} color={COLORS.background} />
                  </TouchableOpacity>
                </>
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="camera" size={32} color={COLORS.textSecondary} />
                  <Text style={{ 
                    color: COLORS.textSecondary, 
                    fontSize: 11, 
                    marginTop: 8
                  }}>
                    {photo.id === 1 ? "Main" : `Photo ${photo.id}`}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )

  const SectionCard = () => {
    const currentSection = formSections[currentSectionIndex]
    
    if (!currentSection) return null

    return (
      <Reanimated.View
        entering={FadeIn.duration(300)}
        style={{
          backgroundColor: COLORS.background,
          borderRadius: 16,
          padding: 20,
          marginHorizontal: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '700', 
            color: COLORS.text,
            marginBottom: 4
          }}>
            {currentSection.label}
          </Text>
          <View style={{ height: 2, width: 40, backgroundColor: COLORS.primary, borderRadius: 1 }} />
        </View>

        {currentSection.fields?.map((field) => {
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

        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between',
          marginTop: 12,
          paddingTop: 20,
          borderTopWidth: 1,
          borderTopColor: COLORS.border
        }}>
          <TouchableOpacity
            onPress={() => {
              if (currentSectionIndex > 0) {
                setCurrentSectionIndex(currentSectionIndex - 1)
                scrollViewRef.current?.scrollTo({ y: 0, animated: true })
              }
            }}
            disabled={currentSectionIndex === 0}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              backgroundColor: currentSectionIndex === 0 ? COLORS.surface : COLORS.background,
              borderWidth: 1,
              borderColor: currentSectionIndex === 0 ? COLORS.border : COLORS.primary,
              opacity: currentSectionIndex === 0 ? 0.5 : 1,
            }}
          >
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: currentSectionIndex === 0 ? COLORS.textSecondary : COLORS.primary 
            }}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (currentSectionIndex < formSections.length - 1) {
                setCurrentSectionIndex(currentSectionIndex + 1)
                scrollViewRef.current?.scrollTo({ y: 0, animated: true })
              }
            }}
            disabled={currentSectionIndex === formSections.length - 1}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              backgroundColor: currentSectionIndex === formSections.length - 1 ? COLORS.surface : COLORS.primary,
              opacity: currentSectionIndex === formSections.length - 1 ? 0.5 : 1,
            }}
          >
            <Text style={{ 
              fontSize: 14, 
              fontWeight: '600', 
              color: currentSectionIndex === formSections.length - 1 ? COLORS.textSecondary : COLORS.background 
            }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </Reanimated.View>
    )
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ fontSize: 16, color: COLORS.text, marginTop: 12 }}>
          Loading profile...
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ProfileHeader />
        
        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
        >
          <SectionCard />
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  )
}

export default ProfileScreen
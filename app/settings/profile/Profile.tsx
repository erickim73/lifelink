"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "../../lib/supabase-client"
import type { UserFormData } from "../../lib/types"
import type { Session } from "@supabase/supabase-js"
import { Loader2, Shield, Save, X } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useIsMobile } from "@/hooks/use-mobile"

const Profile = () => {
  const [authSession, setAuthSession] = useState<Session | null>(null)
  const [userData, setUserData] = useState<UserFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formState, setFormState] = useState<UserFormData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const isMobile = useIsMobile()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          setLoading(false)
          return
        }
        setAuthSession(session)

        const { data, error } = await supabase.from("profiles").select("*").eq("user_id", session.user.id).single()

        if (error) {
          console.error("Error fetching user profile: ", error)
        } else if (data) {
          console.log("Gender from database:", data.gender)

          let normalizedGender = ""
          if (data.gender) {
            const genderLower = data.gender.toLowerCase()
            if (genderLower === "male") {
              normalizedGender = "Male"
            } else if (genderLower === "female") {
              normalizedGender = "Female"
            } else if (genderLower === "non-binary") {
              normalizedGender = "Non-binary"
            } else if (genderLower === "prefer_not_to_say") {
              normalizedGender = "prefer_not_to_say"
            }
          }
          const mappedUserData: UserFormData = {
            firstName: data.first_name,
            lastName: data.last_name,
            gender: normalizedGender,
            dob: data.dob,
            medicalConditions: data.medical_conditions,
            medications: data.medications,
            healthGoals: data.health_goals,
            consentToUseData: data.consent_to_use_data,
          }

          setUserData(mappedUserData)
          setFormState(mappedUserData)
        }
      } catch (error) {
        console.error("Error in profile page:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (loading) {
      return
    }
    if (!authSession) {
      console.log("No session found, redirecting to login")
      router.replace("/login")
    }
  }, [authSession, loading, router])

  const handleInputChange = useCallback(
    (field: keyof UserFormData, value: string) => {
      if (!formState) {
        return
      }

      setFormState({
        ...formState,
        [field]: value,
      })
    },
    [formState],
  )

  const handleSaveChanges = async () => {
    if (!formState || !authSession) {
      return
    }

    try {
      setIsSaving(true)

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: formState.firstName,
          last_name: formState.lastName,
          gender: formState.gender,
          dob: formState.dob,
          medical_conditions: formState.medicalConditions,
          medications: formState.medications,
          health_goals: formState.healthGoals,
          consent_to_use_data: formState.consentToUseData,
        })
        .eq("user_id", authSession.user.id)

      if (error) {
        console.error("Error updating profile:", error)
        alert("Something went wrong while saving.")
      } else {
        setUserData(formState)
        setIsEditing(false) // Exit edit mode after save
      }
    } catch (error) {
      console.error("Error in save operation:", error)
      alert("An unexpected error occurred.")
    } finally {
      setIsSaving(false)
    }
  }

  const toggleEditMode = () => {
    if (isEditing) {
      // cancel editing
      setFormState(userData)
    } else {
      // enter edit mode
      setFormState(userData)
    }
    setIsEditing(!isEditing)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  if (!authSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-white">
        <Shield className="w-12 h-12 mb-4 text-red-400" />
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-gray-400">Please sign in to view your profile</p>
      </div>
    )
  }

  return (
    <div className="w-full p-6 overflow-y-auto">
      <Card className="w-full bg-zinc-900 border-zinc-800">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription className="py-1">Manage your personal information and preferences</CardDescription>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size={isMobile ? "default" : "sm"}
                  onClick={toggleEditMode}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size={isMobile ? "default" : "sm"}
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size={isMobile ? "default" : "sm"}
                onClick={toggleEditMode}
                className="w-full sm:w-auto"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="fullName"
                value={formState?.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Your first name"
                disabled={!isEditing}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formState?.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Your last name"
                disabled={!isEditing}
                className="bg-zinc-800/50 border-zinc-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formState?.gender || ""}
                disabled={!isEditing}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger id="gender" className="w-full bg-zinc-800/50 border-zinc-700">
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formState?.dob || ""}
                onChange={(e) => handleInputChange("dob", e.target.value)}
                disabled={!isEditing}
                className="w-full bg-zinc-800/50 border-zinc-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalConditions">Medical Conditions</Label>
            <Textarea
              id="medicalConditions"
              value={formState?.medicalConditions || ""}
              onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
              placeholder="List any medical conditions"
              disabled={!isEditing}
              className="min-h-[100px] bg-zinc-800/50 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medications">Medications</Label>
            <Textarea
              id="medications"
              value={formState?.medications || ""}
              onChange={(e) => handleInputChange("medications", e.target.value)}
              placeholder="List any medications you are currently taking"
              disabled={!isEditing}
              className="min-h-[100px] bg-zinc-800/50 border-zinc-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="healthGoals">Health Goals</Label>
            <Textarea
              id="healthGoals"
              value={formState?.healthGoals || ""}
              onChange={(e) => handleInputChange("healthGoals", e.target.value)}
              placeholder="Describe your health goals"
              disabled={!isEditing}
              className="min-h-[100px] bg-zinc-800/50 border-zinc-700"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Profile

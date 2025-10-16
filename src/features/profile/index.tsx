import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getNameInitial } from "@/helpers/funtions/getNameInitial";
import { useConf } from "@/hooks/useConf";
import { useRouteContext, useSearch } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CreditCard,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useRef } from "react";

export function ProfileFeat() {
  const hasOpenedRef = useRef(false);
  const search = useSearch({ from: "/_auth/profile" });
  const context = useRouteContext({ from: "__root__" });
  const { useProfileModalStore } = context;
  const { initialValues, openModal } = useProfileModalStore();
  const { data: genderConf } = useConf("GENDER");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const editProfile = () => {
    openModal("edit", initialValues);
  };

  useEffect(() => {
    if (search.update && !hasOpenedRef.current) {
      openModal("edit", initialValues);
      hasOpenedRef.current = true;
    }
  }, [search.update, openModal, initialValues]);

  return (
    <section className="flex">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <CardContent className="pt-0">
                <div className="flex flex-col items-center -mt-12">
                  <div className="relative w-24 h-24">
                    {initialValues?.user_profile?.profile_url && (
                      <Skeleton className="absolute inset-0 w-24 h-24 rounded-full" />
                    )}

                    <Avatar className="w-24 h-24 border-4 border-white shadow-lg relative">
                      {initialValues?.user_profile?.profile_url ? (
                        <AvatarImage
                          src={initialValues.user_profile.profile_url}
                          onLoad={(e) =>
                            (
                              e.currentTarget
                                .previousElementSibling as HTMLElement
                            )?.remove()
                          }
                          onError={(e) =>
                            (
                              e.currentTarget
                                .previousElementSibling as HTMLElement
                            )?.remove()
                          }
                        />
                      ) : (
                        <AvatarFallback className="bg-indigo-100 text-primary text-2xl font-bold">
                          {getNameInitial(initialValues?.first_name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 mt-4">
                    {initialValues?.first_name} {initialValues?.last_name}
                  </h1>
                  <div className="flex space-x-2 my-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      Active
                    </Badge>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                  <Button
                    onClick={editProfile}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Connections
                      </p>
                      <p className="text-sm text-slate-600">247</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Projects</p>
                      <p className="text-sm text-slate-600">12 Completed</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Rating</p>
                      <p className="text-sm text-slate-600">4.9/5.0</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <h2 className="text-lg">Profile Details</h2>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">
                            Email Address
                          </p>
                          <p className="font-medium text-slate-900">
                            {initialValues?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Phone Number</p>
                          <p className="font-medium text-slate-900">
                            {initialValues?.phone_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Location</p>
                          <p className="font-medium text-slate-900">
                            Jakarta, Indonesia
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">
                            Date of Birth
                          </p>
                          <p className="font-medium text-slate-900">
                            {formatDate(initialValues?.user_profile?.dob)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">
                            Aadhar Number
                          </p>
                          <p className="font-medium text-slate-900">
                            {initialValues?.user_profile?.aadhaar_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">Gender</p>
                          <p className="font-medium text-slate-900">
                            {
                              genderConf?.find(
                                (g: { id: string; key: string }) =>
                                  g.id === initialValues?.user_profile?.gender
                              )?.key
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Completed Project Alpha
                      </p>
                      <p className="text-xs text-slate-600">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Added 5 new connections
                      </p>
                      <p className="text-xs text-slate-600">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        Updated profile information
                      </p>
                      <p className="text-xs text-slate-600">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

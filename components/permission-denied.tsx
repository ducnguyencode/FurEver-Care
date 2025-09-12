"use client";

import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PermissionDeniedProps {
  title?: string;
  message?: string;
  onBack?: () => void;
  userRole?: string;
  requiredRole?: string;
}

export default function PermissionDenied({
  title = "Access Denied",
  message = "You don't have permission to access this feature.",
  onBack,
  userRole,
  requiredRole,
}: PermissionDeniedProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl border-0 bg-gradient-to-br from-card to-card/95">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-destructive text-xl font-bold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {message}
          </p>
          
          {userRole && requiredRole && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <span className="font-medium">Your Role:</span> {userRole}
              </p>
              <p className="text-sm">
                <span className="font-medium">Required Role:</span> {requiredRole}
              </p>
            </div>
          )}
          
          <div className="pt-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

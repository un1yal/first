"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
 const { theme, setTheme } = useTheme();

 return (
 <div className="space-y-6">
 <div>
 <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
 <p className="mt-1 text-sm text-muted-foreground">
 Account preferences and privacy controls.
 </p>
 </div>

 <Card>
 <CardHeader>
 <CardTitle>Preferences</CardTitle>
 </CardHeader>
 <CardContent className="grid gap-4 sm:grid-cols-3">
 <div>
 <p className="mb-2 text-xs text-muted-foreground">Theme</p>
 <Select value={theme} onValueChange={setTheme}>
 <SelectTrigger>
 <SelectValue placeholder="Select theme" />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="dark">Dark Mode</SelectItem>
 <SelectItem value="light">Light Mode</SelectItem>
 <SelectItem value="system">System</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardHeader>
 <CardTitle>Danger zone</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <p className="text-sm text-muted-foreground">
 Account deletion removes StatisticX profile data and retained X-derived snapshots according to retention rules.
 </p>
 <Button variant="destructive" disabled>
 Request account deletion
 </Button>
 </CardContent>
 </Card>
 </div>
 );
}

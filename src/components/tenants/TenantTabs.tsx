import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, DollarSign, MessageSquare, ClipboardCheck, CheckCircle } from "lucide-react";

interface TenantTabsProps {
  tenantId: string;
}

export function TenantTabs({ tenantId }: TenantTabsProps) {
  return (
    <Tabs defaultValue="lease" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="lease" className="flex items-center gap-2 text-xs sm:text-sm">
          <FileText className="w-4 h-4" />
          Lease & Documents
        </TabsTrigger>
        <TabsTrigger value="payments" className="flex items-center gap-2 text-xs sm:text-sm">
          <DollarSign className="w-4 h-4" />
          Payments
        </TabsTrigger>
        <TabsTrigger value="communications" className="flex items-center gap-2 text-xs sm:text-sm">
          <MessageSquare className="w-4 h-4" />
          Communications
        </TabsTrigger>
        <TabsTrigger value="screening" className="flex items-center gap-2 text-xs sm:text-sm">
          <ClipboardCheck className="w-4 h-4" />
          Screening
        </TabsTrigger>
      </TabsList>

      <TabsContent value="lease">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Lease Details</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Print Lease</Button>
                <Button variant="outline" size="sm">Email Lease</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Lease Start Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Lease End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Monthly Rent</Label>
                <Input type="number" placeholder="$0.00" />
              </div>
              <div>
                <Label>Security Deposit</Label>
                <Input type="number" placeholder="$0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Late Fee Amount</Label>
                <Input type="number" placeholder="$0.00" />
              </div>
              <div>
                <Label>Grace Period (Days)</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Utilities Included</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Water
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Electric
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Gas
                  </label>
                </div>
              </div>
              <div>
                <Label>Pet Information</Label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Pets Allowed
                  </label>
                  <Input placeholder="Pet Deposit Amount" type="number" />
                </div>
              </div>
            </div>
            <div>
              <Label>Documents</Label>
              <div className="mt-2 space-y-2">
                <Button variant="outline" className="w-full">Upload Lease Agreement</Button>
                <Button variant="outline" className="w-full">Upload Move-in Inspection</Button>
                <Button variant="outline" className="w-full">Upload Insurance Certificate</Button>
                <Button variant="outline" className="w-full">Upload Pet Agreement</Button>
                <Button variant="outline" className="w-full">Upload Addendums</Button>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Payment History</h3>
              <div className="flex gap-2">
                <Button variant="outline">Payment Settings</Button>
                <Button>Record Payment</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground">Balance Due</h4>
                <p className="text-2xl font-bold text-red-500">$1,200.00</p>
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground">Last Payment</h4>
                <p className="text-2xl font-bold">$1,200.00</p>
                <p className="text-xs text-muted-foreground">Dec 1, 2023</p>
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground">Late Fees</h4>
                <p className="text-2xl font-bold text-yellow-500">$50.00</p>
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground">Security Deposit</h4>
                <p className="text-2xl font-bold">$2,400.00</p>
              </Card>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                <div>
                  <p className="font-medium">January 2024 Rent</p>
                  <p className="text-sm text-muted-foreground">Due: Jan 1, 2024</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$1,200.00</p>
                  <p className="text-sm text-green-600">Paid</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-2 bg-secondary/50 rounded">
                <div>
                  <p className="font-medium">December 2023 Rent</p>
                  <p className="text-sm text-muted-foreground">Due: Dec 1, 2023</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">$1,200.00</p>
                  <p className="text-sm text-green-600">Paid</p>
                </div>
              </div>
              {/* Add more payment history items */}
            </div>
            <div className="flex justify-end">
              <Button variant="outline">View All Transactions</Button>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="communications">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Messages</h3>
              <Button>New Message</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Communication Preferences</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked /> Email Notifications
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked /> SMS Notifications
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" /> Portal Notifications
                  </label>
                </div>
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Notification Types</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked /> Payment Reminders
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked /> Maintenance Updates
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked /> Lease Notifications
                  </label>
                </div>
              </Card>
            </div>
            <div className="space-y-2">
              <div className="p-2 bg-secondary/50 rounded">
                <div className="flex justify-between">
                  <p className="font-medium">Maintenance Request #123</p>
                  <p className="text-sm text-muted-foreground">2 days ago</p>
                </div>
                <p className="text-sm text-muted-foreground">Leaking faucet in master bathroom...</p>
              </div>
              <div className="p-2 bg-secondary/50 rounded">
                <div className="flex justify-between">
                  <p className="font-medium">Rent Reminder</p>
                  <p className="text-sm text-muted-foreground">5 days ago</p>
                </div>
                <p className="text-sm text-muted-foreground">Your rent payment is due in 5 days...</p>
              </div>
              {/* Add more message items */}
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="screening">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Background Check Status</h4>
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed - Pass</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Completed on Dec 15, 2023</p>
              </Card>
              <Card className="p-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Credit Check Status</h4>
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed - Score: 720</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Completed on Dec 15, 2023</p>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">Run Background Check</Button>
              <Button variant="outline" className="w-full">Run Credit Check</Button>
            </div>
            <div>
              <Label>References</Label>
              <div className="mt-2 space-y-2">
                <div className="p-2 bg-secondary/50 rounded">
                  <p className="font-medium">Previous Landlord</p>
                  <p className="text-sm text-muted-foreground">John Smith - (555) 123-4567</p>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <p className="font-medium">Employer</p>
                  <p className="text-sm text-muted-foreground">Tech Corp - HR Department</p>
                  <p className="text-sm text-muted-foreground">(555) 987-6543</p>
                </div>
                <div className="p-2 bg-secondary/50 rounded">
                  <p className="font-medium">Personal Reference</p>
                  <p className="text-sm text-muted-foreground">Jane Doe - (555) 456-7890</p>
                </div>
                {/* Add more references */}
              </div>
            </div>
            <Button className="w-full">Add Reference</Button>
            <div className="mt-4">
              <Label>Additional Documents</Label>
              <div className="mt-2 space-y-2">
                <Button variant="outline" className="w-full">Upload Pay Stubs</Button>
                <Button variant="outline" className="w-full">Upload Bank Statements</Button>
                <Button variant="outline" className="w-full">Upload ID Documents</Button>
              </div>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PricingTable } from "@/services/clerk/components/PricingTable"

export default function EmployerPricingPage() {
  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Pricing</h1>
        <p className="text-muted-foreground">
          Manage the plan for your active hiring organization.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Organization Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <PricingTable />
        </CardContent>
      </Card>
    </div>
  )
}

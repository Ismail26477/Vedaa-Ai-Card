import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const plans = [
  {
    name: "Enterprise Lite Plan",
    desc: "Customize, brand, and analyze your cards",
    price: "INR 423 /-",
    billing: "Billed Annually",
    features: [
      { text: "Create Upto 1 card", included: true },
      { text: "500 Card Shares", included: true },
      { text: "100 Paper Card Scans", included: true },
      { text: "Customizable subdomain", included: true },
      { text: "Enterprise Grade Security", included: true },
      { text: "Custom Email Signatures", included: true },
      { text: "Standard Analytics", included: true },
      { text: "Create your own card template", included: true },
      { text: "CRM Integrations", included: false },
      { text: "Outlook Integration", included: false },
      { text: "Access to all leads & connections", included: false },
      { text: "Advanced Analytics", included: false },
    ],
  },
  {
    name: "Enterprise Standard Plan",
    desc: "Do more with better integrations",
    price: "INR 2500 /-",
    billing: "Billed Annually",
    popular: true,
    features: [
      { text: "Create Upto 3 cards", included: true },
      { text: "1000 Card Shares", included: true },
      { text: "500 Paper Card Scans", included: true },
      { text: "CRM Integrations", included: true },
      { text: "Outlook Integration", included: true },
      { text: "Customizable subdomain", included: true },
      { text: "Access to all leads & connections", included: true },
      { text: "Enterprise Grade Security", included: true },
      { text: "Custom Email Signatures", included: true },
      { text: "Standard Analytics", included: true },
      { text: "Create your own card template", included: true },
      { text: "Advanced Analytics", included: false },
    ],
  },
  {
    name: "Enterprise Premium Plan",
    desc: "Advanced security, integration, and auth",
    price: "INR 6000 /-",
    billing: "Billed Annually",
    features: [
      { text: "Create Upto 3 cards", included: true },
      { text: "5000 Card Shares", included: true },
      { text: "1000 Paper Card Scans", included: true },
      { text: "CRM Integrations", included: true },
      { text: "Outlook Integration", included: true },
      { text: "Customizable subdomain", included: true },
      { text: "Access to all leads & connections", included: true },
      { text: "Enterprise Grade Security", included: true },
      { text: "Custom Email Signatures", included: true },
      { text: "Standard Analytics", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Email & Online Support", included: true },
    ],
  },
  {
    name: "Large Enterprises",
    desc: "For more than 50 users, contact us",
    price: "Contact Us",
    billing: "",
    features: [
      { text: "Create Upto 3 cards", included: true },
      { text: "5000 Card Shares", included: true },
      { text: "1000 Paper Card Scans", included: true },
      { text: "CRM Integrations", included: true },
      { text: "Outlook Integration", included: true },
      { text: "Customizable subdomain", included: true },
      { text: "Access to all leads & connections", included: true },
      { text: "Enterprise Grade Security", included: true },
      { text: "Custom Email Signatures", included: true },
      { text: "Standard Analytics", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Create your own card template", included: true },
    ],
  },
];

export default function Billing() {
  return (
    <div className="page-container animate-fade-in">
      <div className="mb-6">
        <p className="text-sm font-semibold text-warning uppercase">Pricing for Everyone</p>
        <h1 className="text-2xl font-bold font-display mt-1">Choose your Plan</h1>
        <p className="text-sm text-muted-foreground">*Local Taxes are extra wherever applicable</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map(plan => (
          <div key={plan.name} className={`bg-card rounded-xl border p-5 flex flex-col ${plan.popular ? "ring-2 ring-primary" : ""}`}>
            <h3 className="font-bold font-display">{plan.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
            <div className="mt-4 mb-1">
              <span className="text-2xl font-bold font-display">{plan.price}</span>
            </div>
            {plan.billing && <p className="text-xs text-warning font-semibold mb-4">({plan.billing})</p>}
            <hr className="mb-4" />
            <ul className="space-y-2 flex-1">
              {plan.features.map(f => (
                <li key={f.text} className="flex items-start gap-2 text-sm">
                  {f.included ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  {f.text}
                </li>
              ))}
            </ul>
            <Button
              className="mt-5 w-full"
              variant={plan.name === "Large Enterprises" ? "destructive" : "default"}
              onClick={() => toast.success(`${plan.name === "Large Enterprises" ? "Sales team will contact you" : "Upgrade request sent!"}`)}
            >
              {plan.name === "Large Enterprises" ? "Contact Sales" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>

      <div className="text-center mt-6">
        <button className="text-sm text-primary font-medium hover:underline">→ Continue with Free Plan</button>
      </div>
    </div>
  );
}

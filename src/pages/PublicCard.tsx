import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { FaWhatsapp } from "react-icons/fa";
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  ChevronUp,
  Download,
  Send,
  CalendarDays,
  Clock,
  CheckCircle2,
  Globe,
  ExternalLink,
} from "lucide-react";

interface CardData {
  id: string;
  name: string;
  company: string;
  designation: string;
  phone: string;
  email: string;
  address?: string;
  website?: string;
}

const mockCards: Record<string, CardData> = {
  "1": {
    id: "1",
    name: "Anubhav Godre",
    company: "Vedaa Infratech Pvt Ltd",
    designation: "Director",
    phone: "+91 8087115180",
    email: "Contact@vedaainfratech.com",
    address: "301,Vinayak Enclave, Manish Nagar, Nagpur, Maharashtra, 440015, India",
    website: "https://www.vedarealities.com/",
  },
};

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];

// Sub-components
function CardHeader() {
  return (
    <div className="bg-[hsl(220,50%,18%)] text-center py-3 px-4 sticky top-0 z-10">
      <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors">
        Vedaa AI < ExternalLink className="h-3 w-3" />
      </button>
    </div>
  );
}

function CardPreview({ card }: { card: CardData }) {
  return (
    <div className="relative bg-gradient-to-br from-[hsl(210,80%,45%)] via-[hsl(200,70%,55%)] to-[hsl(190,60%,65%)] rounded-2xl overflow-hidden shadow-2xl min-h-[200px]">
      {/* Decorative shapes */}
      <div className="absolute inset-0">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-[hsl(210,90%,35%)] rounded-full opacity-40" />
        <div className="absolute left-10 bottom-0 w-32 h-64 bg-[hsl(220,80%,30%)] rotate-12 opacity-30 rounded-3xl" />
        <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/10 rounded-tl-[80px]" />
      </div>
      <div className="relative z-10 p-6 flex flex-col justify-between min-h-[200px]">
        <div className="text-right">
          <p className="text-white font-bold text-lg leading-tight">{card.name}</p>
          <p className="text-white/80 text-sm mt-0.5">{card.designation}</p>
          <p className="text-white/70 text-xs mt-2">{card.company}</p>
        </div>
        <div className="text-right mt-6">
          <span className="text-white font-bold text-xl tracking-wide">{card.company}</span>
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ onSave, onSendToggle }: { onSave: () => void; onSendToggle: () => void }) {
  return (
    <div className="flex gap-3">
      <Button
        variant="outline"
        className="flex-1 bg-white text-[hsl(220,50%,25%)] border-[hsl(220,30%,70%)] hover:bg-gray-50 font-semibold rounded-xl h-12 text-sm"
        onClick={onSave}
      >
        <Download className="h-4 w-4 mr-2" /> Save In Contacts
      </Button>
      <Button
        className="flex-1 bg-[hsl(220,50%,25%)] hover:bg-[hsl(220,50%,20%)] text-white font-semibold rounded-xl h-12 text-sm"
        onClick={onSendToggle}
      >
        <Send className="h-4 w-4 mr-2" /> Send Your Details
      </Button>
    </div>
  );
}

function ContactInfoSection({ card }: { card: CardData }) {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-6 shadow-sm">
      {/* Mobile */}
      <div>
        <p className="text-[11px] font-bold text-[hsl(220,70%,50%)] uppercase tracking-[0.15em] mb-1.5">Mobile</p>
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-medium text-gray-900">{card.phone}</p>
          <div className="flex gap-4">
            <button
              onClick={() => window.open(`sms:${card.phone}`, "_blank")}
              className="text-[hsl(220,50%,40%)] hover:text-[hsl(220,70%,50%)] transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
            </button>
            <button
  onClick={() =>
    window.open(
      `https://wa.me/${+91 8087115180}`,
      "_blank"
    )
  }
  className="text-green-500 hover:text-green-600 transition-colors"
>
  <FaWhatsapp className="h-5 w-5" />
</button>
            <button
              onClick={() => window.open(`tel:${card.phone}`, "_blank")}
              className="text-[hsl(220,50%,40%)] hover:text-[hsl(220,70%,50%)] transition-colors"
            >
              <Phone className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Email */}
      <div>
        <p className="text-[11px] font-bold text-[hsl(220,70%,50%)] uppercase tracking-[0.15em] mb-1.5">Email</p>
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-medium text-gray-900">{card.email}</p>
          <button
            onClick={() => window.open(`mailto:${card.email}`, "_blank")}
            className="text-[hsl(220,50%,40%)] hover:text-[hsl(220,70%,50%)] transition-colors"
          >
            <Mail className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Address */}
      {card.address && (
        <div>
          <p className="text-[11px] font-bold text-[hsl(220,70%,50%)] uppercase tracking-[0.15em] mb-1.5">Address</p>
          <div className="flex items-start justify-between gap-3">
            <p className="text-[15px] font-medium text-gray-900 leading-relaxed">{card.address}</p>
            <button
              onClick={() =>
                window.open(`https://maps.google.com/?q=${encodeURIComponent(card.address || "")}`, "_blank")
              }
              className="text-[hsl(220,50%,40%)] hover:text-[hsl(220,70%,50%)] transition-colors mt-0.5 shrink-0"
            >
              <MapPin className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Website */}
      {card.website && (
        <div>
          <p className="text-[11px] font-bold text-[hsl(220,70%,50%)] uppercase tracking-[0.15em] mb-1.5">
            Company Website
          </p>
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-medium text-gray-900">{card.website}</p>
            <button
              onClick={() => window.open(card.website, "_blank")}
              className="text-[hsl(220,50%,40%)] hover:text-[hsl(220,70%,50%)] transition-colors"
            >
              <Globe className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MeetingSection({ card, senderForm }: { card: CardData; senderForm: any }) {
  const [show, setShow] = useState(false);
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingNote, setMeetingNote] = useState("");
  const [booked, setBooked] = useState(false);

  const handleBook = async () => {
    if (!meetingDate || !meetingTime) {
      toast.error("Please select a date and time");
      return;
    }
    const { error } = await supabase.from("meetings").insert({
      card_id: card.id,
      title: `Meeting with ${senderForm.firstName || "Visitor"} ${senderForm.lastName || ""}`.trim(),
      meeting_date: meetingDate.toISOString().split("T")[0],
      meeting_time: meetingTime,
      note: meetingNote,
      booked_by_email: senderForm.email || null,
      booked_by_name: `${senderForm.firstName || ""} ${senderForm.lastName || ""}`.trim() || null,
      owner_email: card.email || null,
      type: "meeting",
    });
    if (error) {
      toast.error("Failed to book meeting");
      return;
    }
    setBooked(true);
    toast.success("Meeting booked successfully!");
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <button onClick={() => setShow(!show)} className="w-full flex items-center justify-between p-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[hsl(220,70%,50%)]" />
          <span className="font-semibold text-gray-900">Book a Meeting</span>
        </div>
        {show ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      {show && (
        <div className="px-5 pb-5 space-y-4">
          {booked ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="font-semibold text-gray-900">Meeting Booked!</p>
              <p className="text-sm text-gray-500">
                {meetingDate?.toLocaleDateString()} at {meetingTime}
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500">Select a date and time to schedule a meeting with {card.name}</p>
              <Calendar
                mode="single"
                selected={meetingDate}
                onSelect={setMeetingDate}
                disabled={(d) => d < new Date()}
                className="rounded-lg border mx-auto"
              />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <Select value={meetingTime} onValueChange={setMeetingTime}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Add a note (optional)"
                value={meetingNote}
                onChange={(e) => setMeetingNote(e.target.value)}
                className="resize-none"
                rows={2}
              />
              <Button
                className="w-full bg-[hsl(220,70%,50%)] hover:bg-[hsl(220,70%,45%)] text-white rounded-xl"
                onClick={handleBook}
              >
                Confirm Meeting
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SendDetailsSection({ card }: { card: CardData }) {
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designation: "",
    company: "",
    address: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "India",
    state: "",
  });

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.phone) {
      toast.error("Please fill in required fields (Name, Email, Phone)");
      return;
    }
    if (!acceptPrivacy) {
      toast.error("Please accept the privacy policy");
      return;
    }
    const { error } = await supabase.from("leads").insert({
      card_id: card.id,
      first_name: form.firstName,
      last_name: form.lastName || null,
      email: form.email,
      phone: form.phone,
      designation: form.designation || null,
      company: form.company || null,
      address: form.address || null,
      address2: form.address2 || null,
      city: form.city || null,
      postal_code: form.postalCode || null,
      country: form.country,
      state: form.state || null,
    });
    if (error) {
      toast.error("Failed to share details");
      return;
    }
    setSent(true);
    toast.success("Details shared successfully!");
  };

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <button onClick={() => setShow(!show)} className="w-full flex items-center justify-between p-5">
        <div>
          <span className="font-semibold text-gray-900">Send your details</span>
          <p className="text-xs text-gray-500 mt-0.5">The details will be sent to {card.name}</p>
        </div>
        {show ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>
      {show && (
        <div className="px-5 pb-5 space-y-3">
          {sent ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <p className="font-semibold text-gray-900">Details Shared Successfully</p>
            </div>
          ) : (
            <>
              <Input
                placeholder="Enter First Name*"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />
              <Input
                placeholder="Enter Last Name"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
              <Input
                placeholder="Enter Email*"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              <div className="flex gap-2">
                <Select defaultValue="+91">
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">IN +91</SelectItem>
                    <SelectItem value="+1">US +1</SelectItem>
                    <SelectItem value="+44">UK +44</SelectItem>
                    <SelectItem value="+971">UAE +971</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter Mobile Number*"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="flex-1"
                />
              </div>
              <Input
                placeholder="Enter Designation"
                value={form.designation}
                onChange={(e) => update("designation", e.target.value)}
              />
              <Input
                placeholder="Enter Company"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
              />
              <Input
                placeholder="Enter Address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
              <Input
                placeholder="Enter Address 2"
                value={form.address2}
                onChange={(e) => update("address2", e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Enter City"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Enter Postal Code"
                  value={form.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <Select value={form.country} onValueChange={(v) => update("country", v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="India">🇮🇳 India</SelectItem>
                    <SelectItem value="USA">🇺🇸 USA</SelectItem>
                    <SelectItem value="UK">🇬🇧 UK</SelectItem>
                    <SelectItem value="UAE">🇦🇪 UAE</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={form.state} onValueChange={(v) => update("state", v)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Checkbox checked={acceptPrivacy} onCheckedChange={(v) => setAcceptPrivacy(v === true)} id="privacy" />
                <label htmlFor="privacy" className="text-xs text-gray-500">
                  I hereby accept the{" "}
                  <span className="text-[hsl(220,70%,50%)] font-medium">Vedaa AI Privacy Policy</span>.
                </label>
              </div>
              <Button
                className="w-full bg-[hsl(220,70%,50%)] hover:bg-[hsl(220,70%,45%)] text-white mt-2 rounded-xl"
                onClick={handleSubmit}
              >
                Submit Details
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function PublicCard() {
  const { id } = useParams();
  const [card, setCard] = useState<CardData | null>(null);
  const [showSendDetails, setShowSendDetails] = useState(false);

  useEffect(() => {
    if (id && mockCards[id]) setCard(mockCards[id]);
  }, [id]);

  if (!card) {
    return (
      <div className="min-h-screen bg-[hsl(220,30%,12%)] flex items-center justify-center">
        <p className="text-white/50 text-sm">Card not found</p>
      </div>
    );
  }

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${card.name}\nORG:${card.company}\nTITLE:${card.designation}\nTEL:${card.phone}\nEMAIL:${card.email}\n${card.address ? `ADR:;;${card.address}` : ""}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.name}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Contact file downloaded!");
  };

  return (
    <div className="min-h-screen bg-[hsl(220,35%,12%)]">
      <CardHeader />
      <div className="max-w-lg mx-auto px-4 py-5 space-y-4">
        <CardPreview card={card} />
        <ActionButtons onSave={handleSaveContact} onSendToggle={() => setShowSendDetails(!showSendDetails)} />
        <ContactInfoSection card={card} />
        <MeetingSection card={card} senderForm={{}} />
        <SendDetailsSection card={card} />
        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-[11px] text-white/30">
            Powered by <span className="font-semibold text-white/50">Vedaa AI</span>
          </p>
        </div>
      </div>
    </div>
  );
}

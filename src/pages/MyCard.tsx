import { useState } from "react";
import { Plus, Share2, Edit, Eye, Mail, QrCode, Trash2, Download, Printer, Palette } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cardTemplates, CardTemplatePicker, CardPreviewRenderer, type CardTemplate } from "@/components/card-templates";

const fontOptions = ["Inter", "Plus Jakarta Sans", "Poppins", "Roboto", "Georgia"];
const cardTypes = ["Personal", "Business", "Corporate", "Freelancer", "Student", "Creative"];

interface Card {
  id: string;
  name: string;
  company: string;
  designation: string;
  phone: string;
  email: string;
  primary: boolean;
  templateId: string;
  primaryColor: string;
  accentColor: string;
  font: string;
  type: string;
}

const defaultTemplate = cardTemplates[0];

export default function MyCard() {
  const [cards, setCards] = useState<Card[]>([
    {
      id: "1",
      name: "Anubhav Godre",
      company: "Vedaa Infratech",
      designation: "Director",
      phone: "+91 8087115180",
      email: "Contact@vedaainfratech.com",
      primary: true,
      templateId: "gradient",
      primaryColor: "#3B82F6",
      accentColor: "#8B5CF6",
      font: "Plus Jakarta Sans",
      type: "Business",
    },
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [editCard, setEditCard] = useState<Card | null>(null);
  const [shareCard, setShareCard] = useState<Card | null>(null);
  const [qrCard, setQrCard] = useState<Card | null>(null);
  const [previewCard, setPreviewCard] = useState<Card | null>(null);
  const [styleCard, setStyleCard] = useState<Card | null>(null);
  const [form, setForm] = useState({ name: "", company: "", designation: "", phone: "", email: "", type: "Business" });

  const getTemplate = (id: string) => cardTemplates.find((t) => t.id === id) || defaultTemplate;

  const createCard = () => {
    if (!form.name) {
      toast.error("Name is required");
      return;
    }
    setCards([
      ...cards,
      {
        id: Date.now().toString(),
        ...form,
        primary: cards.length === 0,
        templateId: defaultTemplate.id,
        primaryColor: defaultTemplate.defaultPrimary,
        accentColor: defaultTemplate.defaultAccent,
        font: defaultTemplate.font,
      },
    ]);
    setForm({ name: "", company: "", designation: "", phone: "", email: "", type: "Business" });
    setShowCreate(false);
    toast.success("Card created!");
  };

  const updateCard = () => {
    if (!editCard) return;
    setCards(cards.map((c) => (c.id === editCard.id ? editCard : c)));
    setEditCard(null);
    toast.success("Card updated!");
  };

  const saveStyle = () => {
    if (!styleCard) return;
    setCards(cards.map((c) => (c.id === styleCard.id ? styleCard : c)));
    setStyleCard(null);
    toast.success("Card style saved!");
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
    toast.success("Card deleted");
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-display">My Cards</h1>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="h-4 w-4" /> New Card
        </Button>
      </div>

      <div className="space-y-6">
        {cards.map((card, i) => {
          const tmpl = getTemplate(card.templateId);
          return (
            <div key={card.id} className="bg-card rounded-xl border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 text-success flex items-center justify-center text-sm font-bold">
                    {card.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      CARD {i + 1} · {card.type}
                    </p>
                    <p className="font-semibold">{card.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {card.primary && (
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      PRIMARY
                    </span>
                  )}
                  <button onClick={() => deleteCard(card.id)} className="p-1.5 hover:bg-secondary rounded">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg">
                <CardPreviewRenderer
                  template={tmpl}
                  card={card}
                  colors={{ primary: card.primaryColor, accent: card.accentColor }}
                  font={card.font}
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => setStyleCard({ ...card })} className="gap-1">
                  <Palette className="h-3 w-3" /> Style
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShareCard(card)} className="gap-1">
                  <Share2 className="h-3 w-3" /> Share
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditCard({ ...card })} className="gap-1">
                  <Edit className="h-3 w-3" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPreviewCard(card)} className="gap-1">
                  <Eye className="h-3 w-3" /> Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("Email signature copied!")}
                  className="gap-1"
                >
                  <Mail className="h-3 w-3" /> Email Signature
                </Button>
                <Button variant="outline" size="sm" onClick={() => setQrCard(card)} className="gap-1">
                  <QrCode className="h-3 w-3" /> Print QR
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Full Name *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
            <Input
              placeholder="Designation"
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div>
              <label className="text-sm font-medium mb-1 block">Card Type</label>
              <Select value={form.type} onValueChange={(t) => setForm({ ...form, type: t })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cardTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={createCard} className="w-full">
              Create Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCard} onOpenChange={() => setEditCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          {editCard && (
            <div className="space-y-3">
              <Input
                value={editCard.name}
                onChange={(e) => setEditCard({ ...editCard, name: e.target.value })}
                placeholder="Name"
              />
              <Input
                value={editCard.company}
                onChange={(e) => setEditCard({ ...editCard, company: e.target.value })}
                placeholder="Company"
              />
              <Input
                value={editCard.designation}
                onChange={(e) => setEditCard({ ...editCard, designation: e.target.value })}
                placeholder="Designation"
              />
              <Input
                value={editCard.phone}
                onChange={(e) => setEditCard({ ...editCard, phone: e.target.value })}
                placeholder="Phone"
              />
              <Input
                value={editCard.email}
                onChange={(e) => setEditCard({ ...editCard, email: e.target.value })}
                placeholder="Email"
              />
              <div>
                <label className="text-sm font-medium mb-1 block">Card Type</label>
                <Select value={editCard.type} onValueChange={(t) => setEditCard({ ...editCard, type: t })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cardTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={updateCard} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Style Dialog */}
      <Dialog open={!!styleCard} onOpenChange={() => setStyleCard(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Card Style</DialogTitle>
          </DialogHeader>
          {styleCard && (
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium mb-2">Choose Template</p>
                <CardTemplatePicker
                  selected={styleCard.templateId}
                  onSelect={(t: CardTemplate) =>
                    setStyleCard({
                      ...styleCard,
                      templateId: t.id,
                      primaryColor: t.defaultPrimary,
                      accentColor: t.defaultAccent,
                      font: t.font,
                    })
                  }
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={styleCard.primaryColor}
                      onChange={(e) => setStyleCard({ ...styleCard, primaryColor: e.target.value })}
                      className="h-10 w-10 rounded cursor-pointer border"
                    />
                    <Input
                      value={styleCard.primaryColor}
                      onChange={(e) => setStyleCard({ ...styleCard, primaryColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Accent Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={styleCard.accentColor}
                      onChange={(e) => setStyleCard({ ...styleCard, accentColor: e.target.value })}
                      className="h-10 w-10 rounded cursor-pointer border"
                    />
                    <Input
                      value={styleCard.accentColor}
                      onChange={(e) => setStyleCard({ ...styleCard, accentColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Font</label>
                  <Select value={styleCard.font} onValueChange={(f) => setStyleCard({ ...styleCard, font: f })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Live Preview</p>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <CardPreviewRenderer
                    template={getTemplate(styleCard.templateId)}
                    card={styleCard}
                    colors={{ primary: styleCard.primaryColor, accent: styleCard.accentColor }}
                    font={styleCard.font}
                  />
                </div>
              </div>

              <Button onClick={saveStyle} className="w-full">
                Apply Style
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={!!shareCard} onOpenChange={() => setShareCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Card</DialogTitle>
          </DialogHeader>
          <div className="mb-3">
            <p className="text-xs text-muted-foreground mb-1">Card Link</p>
            <div className="flex gap-2">
              <Input readOnly value={`${window.location.origin}/card/${shareCard?.id}`} className="text-xs" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/card/${shareCard?.id}`);
                  toast.success("Link copied!");
                }}
              >
                Copy
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(`Check out my card: ${window.location.origin}/card/${shareCard?.id}`)}`,
                  "_blank",
                );
                setShareCard(null);
              }}
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.open(
                  `mailto:?subject=My Digital Card&body=${encodeURIComponent(`Check out my card: ${window.location.origin}/card/${shareCard?.id}`)}`,
                  "_blank",
                );
                setShareCard(null);
              }}
            >
              Email
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                window.open(
                  `sms:?body=${encodeURIComponent(`Check out my card: ${window.location.origin}/card/${shareCard?.id}`)}`,
                  "_blank",
                );
                setShareCard(null);
              }}
            >
              SMS
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/card/${shareCard?.id}`);
                toast.success("Link copied!");
                setShareCard(null);
              }}
            >
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={!!qrCard} onOpenChange={() => setQrCard(null)}>
        <DialogContent className="text-center max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-4 rounded-xl inline-block" id="qr-code-container">
              <QRCodeSVG value={`${window.location.origin}/card/${qrCard?.id}`} size={200} level="H" includeMargin />
            </div>
            <p className="text-xs text-muted-foreground break-all">{`${window.location.origin}/card/${qrCard?.id}`}</p>
            <p className="text-sm text-muted-foreground">Scan to view {qrCard?.name}'s card</p>
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 gap-1"
                onClick={() => {
                  const svg = document.querySelector("#qr-code-container svg");
                  if (!svg) return;
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const canvas = document.createElement("canvas");
                  canvas.width = 250;
                  canvas.height = 250;
                  const ctx = canvas.getContext("2d");
                  const img = new Image();
                  img.onload = () => {
                    ctx?.drawImage(img, 0, 0);
                    const a = document.createElement("a");
                    a.download = `${qrCard?.name}-qr.png`;
                    a.href = canvas.toDataURL("image/png");
                    a.click();
                    toast.success("QR downloaded!");
                  };
                  img.src = "data:image/svg+xml;base64," + btoa(svgData);
                }}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
              <Button
                className="flex-1 gap-1"
                onClick={() => {
                  const printWindow = window.open("", "_blank");
                  if (!printWindow) return;
                  const svg = document.querySelector("#qr-code-container svg");
                  if (!svg) return;
                  const svgData = new XMLSerializer().serializeToString(svg);
                  printWindow.document.write(
                    `<html><head><title>QR Code - ${qrCard?.name}</title><style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;margin:0}.card{text-align:center;padding:40px}h2{margin:0 0 4px}p{margin:4px 0;color:#666;font-size:14px}</style></head><body><div class="card"><h2>${qrCard?.name}</h2><p>${qrCard?.designation} · ${qrCard?.company}</p><div style="margin:24px 0">${svgData}</div><p style="font-size:12px;color:#999">Scan to view digital card</p></div></body></html>`,
                  );
                  printWindow.document.close();
                  printWindow.print();
                  toast.success("Print dialog opened!");
                }}
              >
                <Printer className="h-4 w-4" /> Print
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewCard} onOpenChange={() => setPreviewCard(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Card Preview</DialogTitle>
          </DialogHeader>
          {previewCard && (
            <div className="rounded-xl overflow-hidden shadow-lg">
              <CardPreviewRenderer
                template={getTemplate(previewCard.templateId)}
                card={previewCard}
                colors={{ primary: previewCard.primaryColor, accent: previewCard.accentColor }}
                font={previewCard.font}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

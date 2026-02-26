import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarDays, Clock, Link2, Plus, Trash2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  fromDb?: boolean;
  bookedByName?: string;
  bookedByEmail?: string;
  note?: string;
};

const defaultEvents: CalendarEvent[] = [
  { id: "default-1", title: "Team Standup", date: "2026-02-19", time: "09:00 AM", type: "meeting" },
  { id: "default-2", title: "Client Demo", date: "2026-02-20", time: "02:00 PM", type: "demo" },
  { id: "default-3", title: "Networking Event", date: "2026-02-22", time: "06:00 PM", type: "event" },
];

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(defaultEvents);
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", type: "meeting" });
  const [syncGoogle, setSyncGoogle] = useState(false);
  const [syncOutlook, setSyncOutlook] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Load meetings from database
  useEffect(() => {
    supabase
      .from("meetings")
      .select("*")
      .order("meeting_date", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          const dbEvents: CalendarEvent[] = data.map((m: any) => ({
            id: m.id,
            title: m.title,
            date: m.meeting_date,
            time: m.meeting_time,
            type: m.type || "meeting",
            fromDb: true,
            bookedByName: m.booked_by_name,
            bookedByEmail: m.booked_by_email,
            note: m.note,
          }));
          setEvents([...defaultEvents, ...dbEvents]);
        }
      });
  }, []);

  const selectedDateStr = date?.toISOString().split("T")[0];
  const eventsForDate = events.filter(e => e.date === selectedDateStr);
  const upcomingEvents = events
    .filter(e => e.date >= (new Date().toISOString().split("T")[0]))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const addEvent = () => {
    if (!newEvent.title || !newEvent.time) return toast.error("Fill in all fields");
    const localEvent: CalendarEvent = {
      id: `local-${Date.now()}`,
      title: newEvent.title,
      date: date?.toISOString().split("T")[0] || "",
      time: newEvent.time,
      type: newEvent.type,
    };
    setEvents([...events, localEvent]);
    setNewEvent({ title: "", time: "", type: "meeting" });
    setShowAdd(false);
    toast.success("Event added!");
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success("Event removed");
  };

  // Highlight dates with events on calendar
  const eventDates = events.map(e => new Date(e.date + "T00:00:00"));

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-bold font-display mb-6">Calendar</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card rounded-xl border p-4">
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
            <div className="mt-4 space-y-3">
              <h3 className="text-sm font-semibold">Calendar Sync</h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <Link2 className="h-4 w-4 text-muted-foreground" /> Google Calendar
                </div>
                <Switch checked={syncGoogle} onCheckedChange={v => { setSyncGoogle(v); toast.success(v ? "Google Calendar synced" : "Google Calendar disconnected"); }} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <Link2 className="h-4 w-4 text-muted-foreground" /> Outlook Calendar
                </div>
                <Switch checked={syncOutlook} onCheckedChange={v => { setSyncOutlook(v); toast.success(v ? "Outlook Calendar synced" : "Outlook Calendar disconnected"); }} />
              </div>
            </div>
          </div>

          {/* Events for selected date */}
          {selectedDateStr && (
            <div className="bg-card rounded-xl border p-4">
              <h3 className="text-sm font-semibold mb-3">
                Events on {date?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </h3>
              {eventsForDate.length === 0 ? (
                <p className="text-xs text-muted-foreground">No events on this date</p>
              ) : (
                <div className="space-y-2">
                  {eventsForDate.map(ev => (
                    <div
                      key={ev.id}
                      onClick={() => ev.fromDb ? setSelectedEvent(ev) : null}
                      className={`p-3 rounded-lg border text-sm ${ev.fromDb ? "cursor-pointer hover:bg-secondary/50" : ""}`}
                    >
                      <p className="font-medium">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">{ev.time}</p>
                      {ev.fromDb && (
                        <span className="text-[10px] text-primary/60 font-medium">● Booked via card</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="section-title">Upcoming Events</h2>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}>
              <Plus className="h-4 w-4 mr-1" /> Add Event
            </Button>
          </div>

          {showAdd && (
            <div className="bg-card rounded-xl border p-4 space-y-3">
              <Input placeholder="Event title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
              <div className="flex gap-3">
                <Input placeholder="Time (e.g. 10:00 AM)" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                <Select value={newEvent.type} onValueChange={v => setNewEvent({ ...newEvent, type: v })}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="demo">Demo</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addEvent}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {upcomingEvents.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events</p>}
            {upcomingEvents.map(ev => (
              <div
                key={ev.id}
                className={`bg-card rounded-xl border p-4 flex items-center justify-between ${ev.fromDb ? "cursor-pointer hover:shadow-sm transition" : ""}`}
                onClick={() => ev.fromDb ? setSelectedEvent(ev) : null}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${ev.type === "meeting" ? "bg-primary/10 text-primary" : ev.type === "demo" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>
                    {ev.type === "meeting" ? <CalendarDays className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ev.title}</p>
                    <p className="text-xs text-muted-foreground">{ev.date} · {ev.time}</p>
                    {ev.fromDb && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-primary/60 font-medium">● Booked via card</span>
                        {ev.bookedByName && (
                          <span className="text-[10px] text-muted-foreground">by {ev.bookedByName}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded capitalize">{ev.type}</span>
                  <button onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }} className="p-1 hover:bg-destructive/10 rounded"><Trash2 className="h-4 w-4 text-destructive" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Meeting Detail Dialog */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-card rounded-xl border p-6 max-w-md w-full space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-display">{selectedEvent.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{selectedEvent.date} at {selectedEvent.time}</span>
              </div>
              {selectedEvent.bookedByName && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Booked by: {selectedEvent.bookedByName}</span>
                </div>
              )}
              {selectedEvent.bookedByEmail && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Email: {selectedEvent.bookedByEmail}</span>
                </div>
              )}
              {selectedEvent.note && (
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Note</p>
                  <p className="text-sm">{selectedEvent.note}</p>
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setSelectedEvent(null)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

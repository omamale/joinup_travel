'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Sparkles, MapPin, DollarSign, Calendar, Users, Utensils, Zap, Download, Share2, Hotel, Coffee, Star } from 'lucide-react';
import { aiPlannerApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyINR, getErrorMessage } from '@/lib/utils';
import { AIItinerary } from '@joinup/types';

const schema = z.object({
  destination: z.string().min(2, 'Enter a destination'),
  budget: z.number().min(1000, 'Budget must be at least ₹1000'),
  days: z.number().min(1).max(30),
  foodPreference: z.enum(['VEG', 'NON_VEG', 'VEGAN', 'JAIN']),
  travelStyle: z.enum(['RELAXED', 'MODERATE', 'FAST_PACED', 'ADVENTURE']),
  numberOfPeople: z.number().min(1).max(20),
});

type FormValues = z.infer<typeof schema>;

const TRAVEL_STYLES = [
  { value: 'RELAXED', label: 'Relaxed', emoji: '😌', desc: 'Slow travel, lots of rest' },
  { value: 'MODERATE', label: 'Moderate', emoji: '🚶', desc: 'Balanced activities' },
  { value: 'FAST_PACED', label: 'Fast-Paced', emoji: '🏃', desc: 'See as much as possible' },
  { value: 'ADVENTURE', label: 'Adventure', emoji: '🧗', desc: 'Thrilling experiences' },
];

const FOOD_PREFS = [
  { value: 'VEG', label: 'Vegetarian', emoji: '🥦' },
  { value: 'NON_VEG', label: 'Non-Veg', emoji: '🍗' },
  { value: 'VEGAN', label: 'Vegan', emoji: '🌱' },
  { value: 'JAIN', label: 'Jain', emoji: '🙏' },
];

const POPULAR_DESTINATIONS = ['Goa', 'Manali', 'Rishikesh', 'Rajasthan', 'Kerala', 'Ladakh', 'Coorg', 'Andaman'];

export default function AiPlannerPage() {
  const [itinerary, setItinerary] = useState<AIItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  const handleShare = async () => {
    if (!itinerary) return;
    const text = `My AI-planned trip to ${(itinerary as any).destination} — ${(itinerary as any).totalDays} days, budget ₹${(itinerary as any).totalBudget?.toLocaleString('en-IN')}. Planned with JoinUp Travel!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `JoinUp Trip to ${(itinerary as any).destination}`, text });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Itinerary link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!itinerary) return;
    const dest = (itinerary as any).destination || 'trip';
    const lines: string[] = [
      `JoinUp AI Travel Itinerary — ${dest}`,
      `${'='.repeat(50)}`,
      `Total Days: ${(itinerary as any).totalDays}`,
      `Total Budget: ₹${(itinerary as any).totalBudget?.toLocaleString('en-IN')}`,
      `Best Time to Visit: ${(itinerary as any).bestTimeToVisit || ''}`,
      '',
      (itinerary as any).summary || '',
      '',
    ];
    itinerary.days?.forEach((day: any) => {
      lines.push(`Day ${day.day}: ${day.theme}`);
      lines.push(`Estimated Cost: ₹${day.estimatedCost?.toLocaleString('en-IN')}`);
      day.activities?.forEach((a: any) => {
        lines.push(`  ${a.time} — ${a.name} (${a.location}) · ₹${a.cost}`);
        lines.push(`    ${a.description}`);
      });
      if (day.hotel) lines.push(`  Stay: ${day.hotel.name}, ${day.hotel.location} · ₹${day.hotel.pricePerNight}/night`);
      if (day.tips) lines.push(`  Tip: ${day.tips}`);
      lines.push('');
    });
    if (itinerary.travelTips?.length) {
      lines.push('Travel Tips:');
      itinerary.travelTips.forEach((t, i) => lines.push(`  ${i + 1}. ${t}`));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `joinup-${dest.toLowerCase().replace(/\s+/g, '-')}-itinerary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Itinerary downloaded!');
  };

  const searchParams = useSearchParams();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      budget: 20000,
      days: 5,
      foodPreference: 'NON_VEG',
      travelStyle: 'MODERATE',
      numberOfPeople: 2,
    },
  });

  useEffect(() => {
    const dest = searchParams.get('destination');
    if (dest) setValue('destination', dest);
  }, [searchParams, setValue]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setItinerary(null);
    try {
      const res = await aiPlannerApi.generate(data);
      setItinerary(res.data);
      setActiveDay(0);
      toast.success('Your AI itinerary is ready!');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.15)' }}>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">AI Trip Planner</h1>
        </div>
        <p className="text-slate-400">Enter your preferences and get a complete travel itinerary powered by GPT-4</p>
      </div>

      <div className={`grid gap-8 ${itinerary ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto w-full'}`}>
        {/* Input form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
            <h2 className="font-semibold text-white">Plan your trip</h2>

            {/* Destination */}
            <div>
              <Input
                label="Where do you want to go?"
                {...register('destination')}
                error={errors.destination?.message}
                placeholder="e.g., Goa, Manali, Kerala..."
                leftIcon={<MapPin className="w-4 h-4" />}
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => setValue('destination', dest)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      watch('destination') === dest ? 'bg-primary-600 text-white border-primary-600' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget & Days */}
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Total Budget (₹)"
                type="number"
                {...register('budget', { valueAsNumber: true })}
                error={errors.budget?.message}
                leftIcon={<DollarSign className="w-4 h-4" />}
              />
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  <Calendar className="w-4 h-4 inline mr-1 text-primary-500" />
                  Days: {watch('days')}
                </label>
                <input type="range" {...register('days', { valueAsNumber: true })} min={1} max={14} className="w-full accent-primary-600" />
                <div className="flex justify-between text-xs text-slate-500"><span>1</span><span>14</span></div>
              </div>
            </div>

            {/* People */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                <Users className="w-4 h-4 inline mr-1 text-primary-500" />
                Number of People: {watch('numberOfPeople')}
              </label>
              <input type="range" {...register('numberOfPeople', { valueAsNumber: true })} min={1} max={10} className="w-full accent-primary-600" />
            </div>

            {/* Travel Style */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Travel Style</label>
              <div className="grid grid-cols-2 gap-2">
                {TRAVEL_STYLES.map((style) => (
                  <label key={style.value} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    watch('travelStyle') === style.value ? 'border-primary-500' : 'border-white/10 hover:border-white/20'
                  }`}>
                    <input type="radio" {...register('travelStyle')} value={style.value} className="sr-only" />
                    <span className="text-xl">{style.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{style.label}</p>
                      <p className="text-xs text-slate-500">{style.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Food Preference */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Utensils className="w-4 h-4 inline mr-1 text-primary-500" />
                Food Preference
              </label>
              <div className="grid grid-cols-4 gap-2">
                {FOOD_PREFS.map((food) => (
                  <label key={food.value} className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 cursor-pointer transition-all text-center ${
                    watch('foodPreference') === food.value ? 'border-primary-500' : 'border-white/10 hover:border-white/20'
                  }`}>
                    <input type="radio" {...register('foodPreference')} value={food.value} className="sr-only" />
                    <span className="text-lg">{food.emoji}</span>
                    <span className="text-xs font-medium text-slate-300">{food.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
              <Sparkles className="w-4 h-4" />
              {loading ? 'AI is planning your trip...' : 'Generate Itinerary'}
            </Button>

            {loading && (
              <div className="text-center text-sm text-slate-500 animate-pulse">
                Our AI is crafting your perfect {watch('days')}-day {watch('destination')} itinerary...
              </div>
            )}
          </form>
        </div>

        {/* Itinerary output */}
        {itinerary && (
          <div className="space-y-5 animate-slide-up">
            {/* Summary card */}
            <div className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-xl font-bold text-white">{itinerary.destination}</h2>
                  <p className="text-sm text-slate-400">{itinerary.totalDays} days · {formatCurrencyINR(itinerary.totalBudget)} total</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleShare} className="p-2 rounded-xl transition-all text-slate-400 hover:text-white hover:bg-white/10" title="Share itinerary">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button onClick={handleDownload} className="p-2 rounded-xl transition-all text-slate-400 hover:text-white hover:bg-white/10" title="Download as text">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {(itinerary as any).summary && (
                <p className="text-sm text-slate-400 leading-relaxed">{(itinerary as any).summary}</p>
              )}

              {/* Budget breakdown */}
              {itinerary.budgetBreakdown && (
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {Object.entries(itinerary.budgetBreakdown)
                    .filter(([k]) => k !== 'total')
                    .map(([key, val]) => (
                      <div key={key} className="rounded-xl p-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <p className="text-xs text-slate-500 capitalize">{key}</p>
                        <p className="text-sm font-bold text-white">{formatCurrencyINR(val as number)}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Transport options */}
            {(itinerary as any).transportFromPune && (
              <div className="card p-4">
                <h3 className="font-semibold text-white mb-3 text-sm">Getting There from Pune</h3>
                <div className="space-y-2">
                  {Object.entries((itinerary as any).transportFromPune).map(([mode, info]: any) => (
                    <div key={mode} className="flex items-center justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                      <span className="text-slate-400 capitalize font-medium">{mode.replace('by', 'By ')}</span>
                      <div className="text-right">
                        <span className="text-white font-medium">{formatCurrencyINR(info.cost)}</span>
                        <span className="text-gray-400 text-xs ml-2">· {info.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day tabs */}
            <div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {itinerary.days?.map((day: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveDay(i)}
                    className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeDay === i ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    Day {day.day}
                  </button>
                ))}
              </div>

              {itinerary.days?.[activeDay] && (() => {
                const day = itinerary.days[activeDay] as any;
                return (
                  <div className="card p-5 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Day {day.day}: {day.theme}</h3>
                      <Badge variant="primary">{formatCurrencyINR(day.estimatedCost)}</Badge>
                    </div>

                    {/* Activities */}
                    <div className="space-y-2">
                      {day.activities?.map((act: any, i: number) => (
                        <div key={i} className="flex gap-3 p-3 bg-surface rounded-xl">
                          <span className="text-xs font-mono text-primary-500 shrink-0 pt-0.5 w-12">{act.time}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{act.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{act.location} · {act.duration}</p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.description}</p>
                          </div>
                          <span className="text-xs text-gray-500 shrink-0">{formatCurrencyINR(act.cost)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hotel */}
                    {day.hotel && (
                      <div className="p-3 rounded-xl border border-white/10">
                        <div className="flex items-center gap-2 mb-1">
                          <Hotel className="w-4 h-4 text-primary-500" />
                          <span className="text-sm font-semibold text-gray-900">{day.hotel.name}</span>
                          <div className="flex items-center gap-0.5 ml-auto">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-gray-500">{day.hotel.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{day.hotel.location} · {formatCurrencyINR(day.hotel.pricePerNight)}/night</p>
                      </div>
                    )}

                    {/* Meals */}
                    {day.meals?.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Meals</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {day.meals.map((meal: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Coffee className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-xs text-slate-500 w-16 shrink-0">{meal.time}</span>
                              <span className="text-slate-300 font-medium">{meal.restaurant}</span>
                              <span className="text-gray-400 text-xs">· {meal.cuisine}</span>
                              <span className="ml-auto text-xs text-gray-500">{formatCurrencyINR(meal.cost)}</span>
                              {meal.isVeg && <span className="text-green-500 text-xs">🌿</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {day.tips && (
                      <div className="rounded-xl p-3 border border-yellow-500/20">
                        <p className="text-xs font-semibold text-yellow-400 mb-1">💡 Local Tip</p>
                        <p className="text-xs text-yellow-300/80">{day.tips}</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Packing checklist */}
            {itinerary.packingChecklist?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-3">Packing Checklist</h3>
                <div className="grid grid-cols-2 gap-1.5">
                  {itinerary.packingChecklist.map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                      <input type="checkbox" className="accent-primary-600 rounded" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Travel tips */}
            {itinerary.travelTips?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-3">Travel Tips</h3>
                <ul className="space-y-2">
                  {itinerary.travelTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <Zap className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

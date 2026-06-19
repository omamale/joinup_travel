'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { MapPin, Calendar, Users, DollarSign, FileImage, ArrowRight, ArrowLeft } from 'lucide-react';
import { tripsApi, uploadApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getErrorMessage } from '@/lib/utils';

const TRIP_TYPES = ['ADVENTURE', 'LEISURE', 'CULTURAL', 'BUSINESS', 'PILGRIMAGE', 'ROAD_TRIP', 'BACKPACKING'];
const BUDGET_RANGES = ['BUDGET', 'MID_RANGE', 'LUXURY', 'ULTRA_LUXURY'];
const GENDER_PREFS = ['ANY', 'MALE_ONLY', 'FEMALE_ONLY', 'MIXED'];

const schema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  destination: z.string().min(2, 'Enter a valid destination'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.number().min(500, 'Budget must be at least ₹500'),
  budgetRange: z.enum(['BUDGET', 'MID_RANGE', 'LUXURY', 'ULTRA_LUXURY']),
  tripType: z.enum(['ADVENTURE', 'LEISURE', 'CULTURAL', 'BUSINESS', 'PILGRIMAGE', 'ROAD_TRIP', 'BACKPACKING']),
  maxMembers: z.number().min(2, 'Must allow at least 2 members').max(50),
  genderPreference: z.enum(['ANY', 'MALE_ONLY', 'FEMALE_ONLY', 'MIXED']).optional(),
  meetingPoint: z.string().optional(),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const STEPS = ['Basic Info', 'Details', 'Preferences'];

export default function CreateTripPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      budgetRange: 'MID_RANGE',
      tripType: 'LEISURE',
      maxMembers: 6,
      genderPreference: 'ANY',
      budget: 15000,
    },
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const nextStep = async () => {
    const fields: Record<number, (keyof FormValues)[]> = {
      0: ['title', 'description', 'destination'],
      1: ['startDate', 'endDate', 'budget', 'budgetRange', 'tripType', 'maxMembers'],
    };
    const valid = await trigger(fields[step]);
    if (valid) setStep(step + 1);
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      let coverImage: string | undefined;

      if (coverFile) {
        try {
          const res = await uploadApi.tripCover(coverFile);
          coverImage = res.data.url;
        } catch {
          toast('Cover photo upload failed — creating trip without image', { icon: '⚠️' });
        }
      }

      const tags = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

      const res = await tripsApi.create({
        ...data,
        coverImage,
        tags,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });

      toast.success('Trip created successfully!');
      router.push(`/trips/${res.data.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create a Trip</h1>
        <p className="text-gray-500 mt-1">Plan your adventure and find companions from Pune</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${
              i <= step ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${i <= step ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 0: Basic Info */}
        {step === 0 && (
          <div className="card p-6 space-y-5 animate-fade-in">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" /> Basic Information</h2>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo</label>
              <div className="relative">
                {coverPreview ? (
                  <div className="relative h-40 rounded-xl overflow-hidden">
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                      className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-colors">
                    <FileImage className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-400">Click to upload cover photo</p>
                    <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP · Max 5MB</p>
                    <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <Input label="Trip Title" {...register('title')} error={errors.title?.message} placeholder="e.g., Epic Goa Beach Week with Cool People" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea {...register('description')} rows={4} className="input-field resize-none"
                placeholder="Describe your trip plan, what you'll do, the vibe you're going for..." />
              {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
            </div>

            <Input
              label="Destination"
              {...register('destination')}
              error={errors.destination?.message}
              placeholder="e.g., Goa, Manali, Rajasthan"
              leftIcon={<MapPin className="w-4 h-4" />}
            />
          </div>
        )}

        {/* Step 1: Dates & Budget */}
        {step === 1 && (
          <div className="card p-6 space-y-5 animate-fade-in">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-500" /> Dates & Budget</h2>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Start Date" type="date" {...register('startDate')} error={errors.startDate?.message}
                min={new Date().toISOString().split('T')[0]} />
              <Input label="End Date" type="date" {...register('endDate')} error={errors.endDate?.message}
                min={watch('startDate') || new Date().toISOString().split('T')[0]} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Budget per Person (₹)"
                  type="number"
                  {...register('budget', { valueAsNumber: true })}
                  error={errors.budget?.message}
                  leftIcon={<DollarSign className="w-4 h-4" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Category</label>
                <select {...register('budgetRange')} className="input-field">
                  {BUDGET_RANGES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Trip Type</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TRIP_TYPES.map((type) => (
                  <label key={type} className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    watch('tripType') === type ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <input type="radio" {...register('tripType')} value={type} className="sr-only" />
                    <span className="text-lg">{['🏔️', '🏖️', '🏛️', '💼', '🙏', '🚗', '🎒'][TRIP_TYPES.indexOf(type)]}</span>
                    <span className="text-xs font-medium text-gray-700 text-center">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                <Users className="w-4 h-4 inline mr-1 text-primary-500" />Max Members: {watch('maxMembers')}
              </label>
              <input type="range" {...register('maxMembers', { valueAsNumber: true })} min={2} max={20} step={1}
                className="w-full accent-primary-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2</span><span>20</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Preferences */}
        {step === 2 && (
          <div className="card p-6 space-y-5 animate-fade-in">
            <h2 className="font-semibold text-gray-900">Preferences & Details</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender Preference</label>
              <div className="grid grid-cols-2 gap-2">
                {GENDER_PREFS.map((pref) => (
                  <label key={pref} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                    watch('genderPreference') === pref ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <input type="radio" {...register('genderPreference')} value={pref} className="accent-primary-600" />
                    {pref.replace('_', ' ')}
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Meeting Point (Optional)"
              {...register('meetingPoint')}
              placeholder="e.g., Pune Railway Station Platform 1"
              leftIcon={<MapPin className="w-4 h-4" />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma-separated)</label>
              <Input {...register('tags')} placeholder="e.g., beach, party, budget, family-friendly" />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
              <strong>Ready to go!</strong> Your trip will be visible to all JoinUp travelers from Pune.
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-2">
          <Button type="button" variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" variant="primary" onClick={nextStep}>
              Continue <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" variant="primary" loading={loading} size="lg">
              Create Trip 🚀
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

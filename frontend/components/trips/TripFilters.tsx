'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTripStore } from '@/stores/tripStore';
import { Button } from '@/components/ui/Button';

const TRIP_TYPES = ['ADVENTURE', 'LEISURE', 'CULTURAL', 'PILGRIMAGE', 'ROAD_TRIP', 'BACKPACKING'];
const BUDGET_RANGES = [
  { value: '', label: 'Any Budget' },
  { value: '0-10000', label: '₹ Under ₹10k' },
  { value: '10000-25000', label: '₹₹ ₹10k–₹25k' },
  { value: '25000-50000', label: '₹₹₹ ₹25k–₹50k' },
  { value: '50000-999999', label: '₹₹₹₹ ₹50k+' },
];
const GENDER_PREFS = [
  { value: '', label: 'Any' },
  { value: 'ANY', label: 'Mixed' },
  { value: 'MALE_ONLY', label: 'Males Only' },
  { value: 'FEMALE_ONLY', label: 'Females Only' },
];

export function TripFilters() {
  const { filters, setFilters, resetFilters } = useTripStore();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(filters.search || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search });
  };

  const hasActiveFilters = !!(filters.tripType || filters.genderPreference || filters.budgetMin || filters.search);

  return (
    <div className="space-y-4">
      {/* Search row */}
      <div className="flex gap-2 sm:gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="input-field pl-10 w-full text-sm"
          />
        </form>
        <Button
          variant={showFilters ? 'primary' : 'secondary'}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 shrink-0 px-3 sm:px-4"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" onClick={() => { resetFilters(); setSearch(''); }} size="md" className="shrink-0 px-2 sm:px-3">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Trip type quick filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setFilters({ tripType: undefined })}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
            !filters.tripType ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
          }`}
        >
          All Trips
        </button>
        {TRIP_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilters({ tripType: type as any })}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filters.tripType === type ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="card p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Budget Range</label>
            <select
              className="input-field text-sm"
              onChange={(e) => {
                const [min, max] = e.target.value ? e.target.value.split('-').map(Number) : [undefined, undefined];
                setFilters({ budgetMin: min, budgetMax: max });
              }}
            >
              {BUDGET_RANGES.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Gender Preference</label>
            <select
              className="input-field text-sm"
              onChange={(e) => setFilters({ genderPreference: e.target.value as any || undefined })}
            >
              {GENDER_PREFS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Start Date</label>
            <input
              type="date"
              className="input-field text-sm"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setFilters({ startDate: e.target.value ? new Date(e.target.value) : undefined })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

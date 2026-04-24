'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function VideoFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        className="sm:max-w-sm"
        placeholder="Search videos..."
        defaultValue={searchParams.get('search') ?? ''}
        onChange={(e) => updateParam('search', e.target.value)}
      />

      <Select
        defaultValue={searchParams.get('lastUsedAtOrder') ?? 'asc'}
        onValueChange={(value) => updateParam('lastUsedAtOrder', value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by last used" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Last used: newest</SelectItem>
          <SelectItem value="asc">Last used: oldest</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

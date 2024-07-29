import { Button } from 'src/shared/ui/components/chadcn/ui/button';
import { Input } from 'src/shared/ui/components/chadcn/ui/input';

interface SearchBarProps {
  searchValue;
  setSearchValue;
}

export default function SearchBar({
  searchValue,
  setSearchValue,
}: SearchBarProps) {
  const handleOnChangle = (event) => {
    const {
      target: { value },
    } = event;

    setSearchValue(value ?? '');
  };
  return (
    <div className="flex w-full max-w-xl items-center space-x-2">
      <Input
        type="text"
        placeholder="Search......"
        onChange={handleOnChangle}
      />
      <Button type="submit">Search</Button>
    </div>
  );
}

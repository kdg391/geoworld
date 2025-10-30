'use client'

import Image from 'next/image'

import {
  COUNTRY_CODE_TO_OFFICIAL_MAP_ID,
  FLAG_ENOJIS,
  OFFICIAL_MAP_WORLD_ID,
} from '@/constants/index.ts'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.tsx'

import Twemoji from '@/components/Twemoji.tsx'

const mapOptions = [
  {
    value: OFFICIAL_MAP_WORLD_ID,
    label: '전 세계',
    icon: <Twemoji width={18} height={18} alt="전 세계" emoji="🌐" />,
  },
  {
    value: COUNTRY_CODE_TO_OFFICIAL_MAP_ID.kr,
    label: '대한민국',
    icon: (
      <Twemoji width={18} height={18} alt="대한민국" emoji={FLAG_ENOJIS.kr} />
    ),
  },
  {
    value: 'ba416374-105c-48f3-a5aa-22f460ffa3dc',
    label: '서울특별시',
    icon: (
      <Image src="/assets/seoul.svg" width={17} height={18} alt="서울특별시" />
    ),
  },
  {
    value: COUNTRY_CODE_TO_OFFICIAL_MAP_ID.fr,
    label: '프랑스',
    icon: (
      <Twemoji width={18} height={18} alt="프랑스" emoji={FLAG_ENOJIS.fr} />
    ),
  },
  {
    value: COUNTRY_CODE_TO_OFFICIAL_MAP_ID.hk,
    label: '홍콩',
    icon: <Twemoji width={18} height={18} alt="홍콩" emoji={FLAG_ENOJIS.hk} />,
  },
  {
    value: COUNTRY_CODE_TO_OFFICIAL_MAP_ID.us,
    label: '미국',
    icon: <Twemoji width={18} height={18} alt="미국" emoji={FLAG_ENOJIS.us} />,
  },
  {
    value: COUNTRY_CODE_TO_OFFICIAL_MAP_ID.tw,
    label: '대만',
    icon: <Twemoji width={18} height={18} alt="대만" emoji={FLAG_ENOJIS.tw} />,
  },
  {
    value: COUNTRY_CODE_TO_OFFICIAL_MAP_ID.jp,
    label: '일본',
    icon: <Twemoji width={18} height={18} alt="일본" emoji={FLAG_ENOJIS.jp} />,
  },
]

interface Props {
  container?: Element | DocumentFragment | null
  selectedMap: string
  setSelectedMap: React.Dispatch<React.SetStateAction<string>>
}

const MapSelect = ({ container, selectedMap, setSelectedMap }: Props) => {
  const selectedMapId = mapOptions.find((t) => t.value === selectedMap)

  return (
    <Select
      value={selectedMap}
      onValueChange={(value) => {
        setSelectedMap(value)
      }}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue>
          {selectedMapId && (
            <div className="flex items-center gap-2">
              {selectedMapId.icon}
              <span>{selectedMapId.label}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" container={container}>
        <SelectGroup>
          {mapOptions.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default MapSelect

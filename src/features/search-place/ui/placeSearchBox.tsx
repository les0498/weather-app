import { useMemo, useState } from "react";
import { places } from "../../../entities/place/lib/parseDistricts";
import { searchPlaces } from "../../../entities/place/lib/searchPlaces";
import type { Place } from "../../../entities/favorite/model/types";

type PlaceSearchBoxProps = {
  onSelectPlace: (place: Place) => void;
};

export function PlaceSearchBox({ onSelectPlace }: PlaceSearchBoxProps) {
  const [keyword, setKeyword] = useState("");

  const results = useMemo(() => {
    return searchPlaces(places, keyword);
  }, [keyword]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">장소 검색</h2>

      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="장소를 입력하세요."
        className="mt-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
      />

      {keyword.trim() && results.length === 0 && (
        <p className="mt-3 text-sm text-slate-500">검색 결과가 없습니다.</p>
      )}

      {results.length > 0 && (
        <ul className="mt-4 max-h-72 overflow-y-auto rounded-xl border border-slate-200">
          {results.map((place) => (
            <li key={place.id}>
              <button
                type="button"
                onClick={() => {
                  onSelectPlace(place);
                  setKeyword(place.fullName);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-900">{place.name}</span>
                <span className="ml-2 text-slate-500">{place.fullName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

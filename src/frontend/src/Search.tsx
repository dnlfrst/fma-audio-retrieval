import { AutoComplete } from "antd";
import { LabeledValue, RefSelectProps } from "antd/lib/select";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import styled from "styled-components";
import useTracks from "./useTracks";
import Widget from "./Widget";

const WideAutoComplete = styled(AutoComplete)`
  width: 100%;
`;

const Search = ({
  setSelectedTrackID,
}: {
  setSelectedTrackID: Dispatch<SetStateAction<string>>;
}) => {
  const autoComplete = useRef<RefSelectProps>();
  const [options, setOptions] = useState<LabeledValue[]>();
  const [searchTerm, setSearchTerm] = useState<string>();
  const tracks = useTracks();

  const allOptions = tracks.map((track) => {
    return {
      label: `${track.title} (by ${track.artist} in ${track.album})`,
      value: track.ID,
    };
  });

  const onSearch = (searchTerm) =>
    setOptions(
      searchTerm.trim().length === 0
        ? allOptions
        : allOptions.filter((option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );

  return (
    <Widget
      size="small"
      style={{ height: "max-content", left: 75, top: 0, width: 450 }}
      title="Search"
    >
      <WideAutoComplete
        onChange={(searchTerm) => setSearchTerm(searchTerm)}
        onSelect={(selectedTrackID) => {
          setSelectedTrackID(selectedTrackID);
          setSearchTerm("");
          autoComplete.current.blur();
        }}
        onSearch={onSearch}
        options={options}
        placeholder="Search a track by title, interpret, or album..."
        ref={autoComplete}
        value={searchTerm}
      />
    </Widget>
  );
};

export default Search;

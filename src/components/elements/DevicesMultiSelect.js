import React, { useState } from "react";
import MultiSelect from "react-multi-select-component";

export default function DevicesMultiselect() {
    const options = [
        { label: "Smart Phone", value: "smartphone" },
        { label: "Tablet", value: "tablet" },
        { label: "Laptop", value: "laptop" },
        { label: "Desktop", value: "desktop" }
    ];

    const [selected, setSelected] = useState([]);

    return (
        <MultiSelect
            options={options}
            value={selected}
            onChange={setSelected}
            labelledBy={"Select device(s)"}
        />
    );
}
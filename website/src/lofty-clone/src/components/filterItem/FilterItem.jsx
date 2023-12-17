import React, { useRef } from "react";
import "./filterItem.scss";

const FilterItem = ({ title, isFilterItemOpen, setIsFilterItemOpen, items, inputName, selectedItem, setSelectedItem, setServicePrice }) => {

    const itemListRef = useRef();
    const itemInputBox = useRef();

    const handleClick = (isOpen, setIsOpen, listRef, inputBox) => {
        setIsOpen(!isOpen);
        if (listRef.current) {
            listRef.current.style.maxHeight = isOpen
                ? null
                : listRef.current.scrollHeight + "px";
            listRef.current.style.boxShadow = isOpen
                ? null
                : "0 1px 2px 0 rgba(0, 0, 0, 0.15),0 1px 3px 1px rgba(0, 0, 0, 0.1)";
        }
        if (inputBox.current) {
            inputBox.current.click();
        }
    };

    const handleItemChange = (e) => {
        setSelectedItem(e.target.value);
        setServicePrice(items.find(item => item.name === e.target.value).feePerTime);
        itemListRef.current.style.maxHeight = 0;
        itemListRef.current.style.boxShadow = 0;
        itemInputBox.current.click();
    };

    return (
        <div className="filterItem">
            <span className="filterItemTitle">{title}</span>
            <div className="dropdown">
                <div
                    className={`input-box ${isFilterItemOpen ? "open" : ""}`}
                    ref={itemInputBox}
                    onClick={() =>
                        handleClick(isFilterItemOpen, setIsFilterItemOpen, itemListRef, itemInputBox)
                    }
                >
                    {selectedItem || "Select service"}
                </div>
                <div className="list" ref={itemListRef}>
                    {items ?
                        items.map((item) => (
                            <React.Fragment key={item.id}>
                                <input type="radio" name={inputName} id={item.id} value={item.name} onClick={handleItemChange} />
                                <label htmlFor={item.id}>
                                    {item.name}
                                </label>
                            </React.Fragment>
                        )) :
                        "No items"
                    }
                </div>
            </div>
        </div>
    )
};

export default FilterItem;
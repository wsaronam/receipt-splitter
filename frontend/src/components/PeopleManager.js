import React from "react";
import "../styles/PeopleManager.css"




function PeopleManager({
    people,
    newPersonName,
    onNameChange,
    onAddPerson,
    onRemovePerson
}) {

    console.log('PeopleManager props:', { people, newPersonName });
    const handleKeyPress = (e) => {
        if (e.key == 'Enter') {
            onAddPerson();
        }
    };


    return (
        <div className="people-section">
            <h2>People Splitting</h2>
            <div className="add-person">
                <input
                    type="text"
                    placeholder="Enter name"
                    value={newPersonName}
                    onChange={(e) => onNameChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={onAddPerson} className="add-btn">Add</button>
            </div>

            {people.length > 0 && (
                <div className="people-list">
                    {people.map((person, index) => (
                        <div key={index} className="person-card">
                            <span>{person}</span>
                            <button onClick={() => onRemovePerson(person)} className='remove-btn'>x</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}




export default PeopleManager;
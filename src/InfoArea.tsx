import React, { useState } from "react";
import "./App.css";

const InfoArea = () => {
  const [activeTab, setActiveTab] = useState("Entity Retrieval");

  const renderTable = () => {
    switch (activeTab) {
      case "Entity Retrieval":
        return (
          <table>
            <thead>
              <tr>
                <th>Function</th>
                <th>Description</th>
                <th>Parameters</th>
                <th>Return Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>getEntities</td>
                <td>Get all entities of a specific type.</td>
                <td>type: string</td>
                <td>Entity[]</td>
              </tr>
              <tr>
                <td>findEntityById</td>
                <td>Find a specific entity by its ID.</td>
                <td>id: number</td>
                <td>Entity | undefined</td>
              </tr>
              <tr>
                <td>getEntityOnTile</td>
                <td>Get the entity located on a specific tile.</td>
                <td>col: number, row: number</td>
                <td>Entity | undefined</td>
              </tr>
              <tr>
                <td>getMonsters</td>
                <td>Get an array of monster entities.</td>
                <td>None</td>
                <td>Entity[]</td>
              </tr>
              <tr>
                <td>getRocks</td>
                <td>Get an array of rock entities.</td>
                <td>None</td>
                <td>Entity[]</td>
              </tr>
              <tr>
                <td>findQueen</td>
                <td>Get the queen entity.</td>
                <td>None</td>
                <td>Entity</td>
              </tr>
              <tr>
                <td>getHero</td>
                <td>Get the hero entity.</td>
                <td>None</td>
                <td>Entity</td>
              </tr>
            </tbody>
          </table>
        );
      case "Hero Movement":
        return (
          <table>
            <thead>
              <tr>
                <th>Function</th>
                <th>Description</th>
                <th>Parameters</th>
                <th>Return Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>moveHeroUp</td>
                <td>Move the hero up.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>moveHeroDown</td>
                <td>Move the hero down.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>moveHeroLeft</td>
                <td>Move the hero left.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>moveHeroRight</td>
                <td>Move the hero right.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
            </tbody>
          </table>
        );
      case "Hero Attacks":
        return (
          <table>
            <thead>
              <tr>
                <th>Function</th>
                <th>Description</th>
                <th>Parameters</th>
                <th>Return Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>attackUp</td>
                <td>Attack upwards.</td>
                <td>None</td>
                <td>None</td>
              </tr>
              <tr>
                <td>attackDown</td>
                <td>Attack downwards.</td>
                <td>None</td>
                <td>None</td>
              </tr>
              <tr>
                <td>attackLeft</td>
                <td>Attack to the left.</td>
                <td>None</td>
                <td>None</td>
              </tr>
              <tr>
                <td>attackRight</td>
                <td>Attack to the right.</td>
                <td>None</td>
                <td>None</td>
              </tr>
              <tr>
                <td>spinAttack</td>
                <td>Perform a spin attack.</td>
                <td>None</td>
                <td>None</td>
              </tr>
            </tbody>
          </table>
        );
      case "Hero Abilities":
        return (
          <table>
            <thead>
              <tr>
                <th>Function</th>
                <th>Description</th>
                <th>Parameters</th>
                <th>Return Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>selfHeal</td>
                <td>Perform self-healing.</td>
                <td>None</td>
                <td>None</td>
              </tr>
            </tbody>
          </table>
        );
      case "Queen Position Checks":
        return (
          <table>
            <thead>
              <tr>
                <th>Function</th>
                <th>Description</th>
                <th>Parameters</th>
                <th>Return Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>isQueenAboveMe</td>
                <td>Check if the queen is above the hero.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>isQueenBelowMe</td>
                <td>Check if the queen is below the hero.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>isQueenLeftOfMe</td>
                <td>Check if the queen is to the left of the hero.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>isQueenRightOfMe</td>
                <td>Check if the queen is to the right of the hero.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>isQueenInSameRow</td>
                <td>Check if the queen is in the same row as the hero.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
              <tr>
                <td>isQueenInSameColumn</td>
                <td>Check if the queen is in the same column as the hero.</td>
                <td>None</td>
                <td>Boolean</td>
              </tr>
            </tbody>
          </table>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="tabs">
        {["Entity Retrieval", "Hero Movement", "Hero Attacks", "Hero Abilities", "Queen Position Checks"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "10px",
              margin: "5px",
              backgroundColor: activeTab === tab ? "#ddd" : "#fff",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="table-container">{renderTable()}</div>
    </div>
  );
};

export default InfoArea;
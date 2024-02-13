import React from 'react';

interface CardProps {
    heading: string;
    imageSrc: string;
    content: string;
    primaryButton?: string;
    secondaryButton?: string;
    tertiaryButton?: string;
    onPrimaryButtonClick?: () => void;
    onSecondaryButtonClick?: () => void;
    onTertiaryButtonClick?: () => void;
}

const Card: React.FC<CardProps> = ({ heading, imageSrc, content, primaryButton, secondaryButton, tertiaryButton, onPrimaryButtonClick, onSecondaryButtonClick, onTertiaryButtonClick }) => {
    return (
        <div className="card">
            <div className="card-header">
                <div className="card-image"><img src={imageSrc} alt="Card" /></div>
                <div style={{ marginLeft: "1rem", marginBottom: "1.5rem" }}>
                    <div className="card-heading">{heading}</div>
                    <div className="card-content">{content}</div>
                </div>
            </div>
            <div className="buttons">
                {secondaryButton && <button className="secondary-button" onClick={onSecondaryButtonClick}>{secondaryButton}</button>}
                {tertiaryButton && <button className="tertiary-button" onClick={onTertiaryButtonClick}>{tertiaryButton}</button>}
                {primaryButton && <button className="primary-button" onClick={onPrimaryButtonClick}>{primaryButton}</button>}

            </div>
        </div>
    );
};

export default Card;

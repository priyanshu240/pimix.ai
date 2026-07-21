'use client';

import React from 'react';

interface SplineSceneProps {
    /** URL to the Spline scene (.splinecode file) */
    scene: string;
    /** CSS class to apply to the container */
    className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
    // Extract the scene ID from the splinecode URL
    // e.g. "https://prod.spline.design/Fm6Q7NPy5dby1n9x/scene.splinecode" -> "Fm6Q7NPy5dby1n9x"
    const sceneIdMatch = scene.match(/prod\.spline\.design\/([^/]+)/);
    const sceneId = sceneIdMatch ? sceneIdMatch[1] : null;

    if (!sceneId) {
        return <div className={className}>Invalid Spline URL</div>;
    }

    const iframeUrl = `https://my.spline.design/${sceneId}/`;

    return (
        <div className={`relative ${className || ''}`} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <iframe 
                src={iframeUrl} 
                frameBorder="0" 
                width="100%" 
                height="100%" 
                style={{ 
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto',
                    border: 'none',
                    background: 'transparent'
                }}
                title="Spline 3D Background"
            />
        </div>
    );
}

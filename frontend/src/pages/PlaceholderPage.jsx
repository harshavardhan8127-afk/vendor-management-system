import React from 'react';

export default function PlaceholderPage({ title }) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-slate-300">🚧</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-500 text-center max-w-md">
                This page is currently under implementation. The functionality for {title.toLowerCase()} will be available in the next release.
            </p>
        </div>
    );
}

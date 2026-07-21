'use client';
import React from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onTabChange, className = '' }: TabsProps) {
  return (
    <ul className={`nav nav-tabs ${className}`} role="tablist">
      {tabs.map((tab) => (
        <li className="nav-item" key={tab.id} role="presentation">
          <button
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
            role="tab"
          >
            {tab.icon && <span className="me-2">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

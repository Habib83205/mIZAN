'use client';

import React, { FormEvent } from 'react';
import { UserRound, Settings2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/components/providers/AppProvider';

export function ProfileSettings() {
  const { profileName, setProfileName, profileRole, setProfileRole, setNotice } = useAppStore();

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setProfileName(String(data.get('name')));
    setProfileRole(String(data.get('role')));
    setNotice('Profile updated successfully.');
  };

  return (
    <motion.section 
      className="panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '600px', margin: '0 auto' }}
    >
      <div className="panel-heading">
        <div>
          <span className="section-number">USER SETTINGS</span>
          <h2>Profile Configuration<span className="orange">.</span></h2>
        </div>
      </div>
      
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '10px' }}>
           <div className="avatar" style={{ width: '64px', height: '64px', fontSize: '24px' }}>
            {profileName.split(' ').map((part) => part[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{profileName}</h3>
            <span className="muted">{profileRole}</span>
          </div>
        </div>

        <label className="form-field">
          <span>Full Name</span>
          <div className="input-with-icon">
            <UserRound size={16} />
            <input name="name" defaultValue={profileName} required />
          </div>
        </label>
        
        <label className="form-field">
          <span>Role</span>
          <div className="input-with-icon">
            <Settings2 size={16} />
            <input name="role" defaultValue={profileRole} required />
          </div>
        </label>

        <label className="form-field">
          <span>Email Address</span>
          <div className="input-with-icon">
            <input type="email" name="email" defaultValue={`${profileName.split(' ')[0].toLowerCase()}@mezan.com`} />
          </div>
        </label>

        <label className="form-field">
          <span>Notification Preferences</span>
          <select name="notifications" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
            <option>All notifications</option>
            <option>Only critical alerts (Low stock)</option>
            <option>Mute all</option>
          </select>
        </label>

        <motion.button 
          type="submit" 
          className="btn primary" 
          style={{ alignSelf: 'flex-start', marginTop: '10px' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Save size={16} />
          Save Changes
        </motion.button>
      </form>
    </motion.section>
  );
}

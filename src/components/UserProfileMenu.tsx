import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Win98Button from './Win98Button';
import { Edit3, Keyboard, Save, User, UserCog, UserRound, X } from 'lucide-react';

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROFILE_KEY = 'retro-notes-profile';
const DEFAULT_PROFILE = { name: 'RetroNotes User' };

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [draftName, setDraftName] = useState(DEFAULT_PROFILE.name);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as { name?: unknown };
      if (typeof parsed.name === 'string' && parsed.name.trim()) {
        const loaded = { name: parsed.name.trim() };
        setProfile(loaded);
        setDraftName(loaded.name);
      }
    } catch {
      localStorage.removeItem(PROFILE_KEY);
    }
  }, []);

  const startEditing = () => {
    setDraftName(profile.name);
    setIsEditing(true);
  };

  const saveProfile = () => {
    const name = draftName.trim();
    if (!name) return;
    const next = { name };
    setProfile(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setDraftName(profile.name);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 win98-window border-2 border-win98-dark-gray shadow-lg">
        <DialogHeader className="bg-gradient-to-r from-win98-blue to-win98-dark-blue border-b-2 border-win98-dark-gray p-3 win98-inset-reverse">
          <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
            <UserCog size={16} />
            Local Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <div className="flex h-[360px]">
            <TabsList className="flex-col h-full bg-win98-silver border-r border-win98-gray rounded-none space-y-1 p-2 w-[165px]">
              <TabsTrigger
                value="profile"
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-win98-blue data-[state=active]:text-white"
              >
                <User size={16} />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="shortcuts"
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-win98-blue data-[state=active]:text-white"
              >
                <Keyboard size={16} />
                <span>Shortcuts</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 p-4 win98-inset-deep overflow-auto border-l border-win98-gray">
              <TabsContent value="profile" className="h-full">
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <div className="win98-window p-8 rounded-full border-2 border-win98-dark-gray bg-gradient-to-br from-win98-silver to-win98-light-gray">
                    <UserRound size={64} className="text-win98-dark-gray" />
                  </div>

                  {!isEditing ? (
                    <>
                      <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-win98-text">{profile.name}</h3>
                        <p className="text-xs opacity-70">Saved only in this browser.</p>
                      </div>
                      <Win98Button onClick={startEditing} className="flex items-center gap-2">
                        <Edit3 size={14} />
                        Edit Display Name
                      </Win98Button>
                    </>
                  ) : (
                    <>
                      <div className="w-full max-w-xs space-y-2">
                        <label className="text-sm font-bold text-win98-text">Display name:</label>
                        <Input
                          value={draftName}
                          maxLength={48}
                          onChange={(event) => setDraftName(event.target.value)}
                          onKeyDown={(event) => event.key === 'Enter' && saveProfile()}
                          className="win98-inset-deep"
                          autoFocus
                        />
                      </div>
                      <div className="flex gap-3">
                        <Win98Button onClick={saveProfile} className="flex items-center gap-2">
                          <Save size={14} />
                          Save
                        </Win98Button>
                        <Win98Button onClick={cancelEditing} variant="ghost" className="flex items-center gap-2">
                          <X size={14} />
                          Cancel
                        </Win98Button>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="shortcuts" className="h-full">
                <h3 className="font-bold mb-3">Keyboard Shortcuts</h3>
                <div className="win98-inset p-3 space-y-2">
                  {[
                    ['Save note while editing', 'Ctrl+S'],
                    ['Bold text while editing', 'Ctrl+B'],
                    ['Italic text while editing', 'Ctrl+I'],
                    ['Insert link while editing', 'Ctrl+K'],
                    ['Create wiki link', '[[text]]'],
                  ].map(([label, shortcut]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-sm">{label}</span>
                      <kbd className="px-2 py-0.5 win98-window text-xs">{shortcut}</kbd>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileMenu;

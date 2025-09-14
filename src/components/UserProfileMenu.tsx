
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import Win98Button from './Win98Button';
import { 
  UserRound, 
  Settings, 
  Puzzle, 
  Link, 
  User, 
  UserCog,
  ExternalLink,
  LayoutList,
  Edit3,
  Save,
  X
} from 'lucide-react';

interface UserProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'RetroNotes User',
    email: 'user@example.com'
  });
  const [editUserInfo, setEditUserInfo] = useState(userInfo);

  const handleEditProfile = () => {
    setEditUserInfo(userInfo);
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setUserInfo(editUserInfo);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditUserInfo(userInfo);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 win98-window border-2 border-win98-dark-gray shadow-lg">
        <DialogHeader className="bg-gradient-to-r from-win98-blue to-win98-dark-blue border-b-2 border-win98-dark-gray p-3 win98-inset-reverse">
          <DialogTitle className="text-sm font-bold text-white flex items-center gap-2">
            <UserCog size={16} />
            User Profile
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex h-[400px]">
            <TabsList className="flex-col h-full bg-win98-silver border-r border-win98-gray rounded-none space-y-1 p-2 w-[180px]">
              <TabsTrigger 
                value="profile" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-win98-blue data-[state=active]:text-white"
              >
                <User size={16} />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-win98-blue data-[state=active]:text-white"
              >
                <Settings size={16} />
                <span>Settings</span>
              </TabsTrigger>
              <TabsTrigger 
                value="plugins" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-win98-blue data-[state=active]:text-white"
              >
                <Puzzle size={16} />
                <span>Plugin Marketplace</span>
              </TabsTrigger>
              <TabsTrigger 
                value="integrations" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-win98-blue data-[state=active]:text-white"
              >
                <Link size={16} />
                <span>Integrations</span>
              </TabsTrigger>
              <TabsTrigger 
                value="shortcuts" 
                className="w-full justify-start gap-2 px-3 data-[state=active]:bg-win98-blue data-[state=active]:text-white"
              >
                <LayoutList size={16} />
                <span>Keyboard Shortcuts</span>
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
                        <h3 className="text-xl font-bold text-win98-text">{userInfo.name}</h3>
                        <p className="text-sm text-win98-text-secondary win98-inset px-3 py-1 rounded">{userInfo.email}</p>
                      </div>
                      <Win98Button onClick={handleEditProfile} className="flex items-center gap-2">
                        <Edit3 size={14} />
                        Edit Profile
                      </Win98Button>
                    </>
                  ) : (
                    <>
                      <div className="w-full max-w-xs space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-win98-text">Name:</label>
                          <Input
                            value={editUserInfo.name}
                            onChange={(e) => setEditUserInfo({...editUserInfo, name: e.target.value})}
                            className="win98-inset-deep"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-win98-text">Email:</label>
                          <Input
                            value={editUserInfo.email}
                            onChange={(e) => setEditUserInfo({...editUserInfo, email: e.target.value})}
                            className="win98-inset-deep"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Win98Button onClick={handleSaveProfile} className="flex items-center gap-2">
                          <Save size={14} />
                          Save
                        </Win98Button>
                        <Win98Button onClick={handleCancelEdit} variant="ghost" className="flex items-center gap-2">
                          <X size={14} />
                          Cancel
                        </Win98Button>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="h-full">
                <h3 className="font-bold mb-3">User Settings</h3>
                <div className="space-y-3">
                  <div className="win98-window p-2">
                    <h4 className="text-sm font-bold mb-2">General</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Auto-save notes</span>
                      <Win98Button size="sm">Enabled</Win98Button>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Default view mode</span>
                      <Win98Button size="sm">Preview</Win98Button>
                    </div>
                  </div>
                  
                  <div className="win98-window p-2">
                    <h4 className="text-sm font-bold mb-2">Privacy</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Analytics</span>
                      <Win98Button size="sm">Disabled</Win98Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="plugins" className="h-full">
                <h3 className="font-bold mb-3">Plugin Marketplace</h3>
                <div className="win98-window p-2 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold">Calendar View</h4>
                      <p className="text-xs">Organize notes by date</p>
                    </div>
                    <Win98Button size="sm">Install</Win98Button>
                  </div>
                </div>
                <div className="win98-window p-2 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold">LaTeX Support</h4>
                      <p className="text-xs">Write mathematical equations</p>
                    </div>
                    <Win98Button size="sm">Install</Win98Button>
                  </div>
                </div>
                <div className="win98-window p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold">Mind Map</h4>
                      <p className="text-xs">Visual mind mapping tool</p>
                    </div>
                    <Win98Button size="sm">Install</Win98Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="integrations" className="h-full">
                <h3 className="font-bold mb-3">Integrations</h3>
                <div className="win98-window p-2 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold">Google Drive</h4>
                      <p className="text-xs">Sync notes with Google Drive</p>
                    </div>
                    <Win98Button size="sm">Connect</Win98Button>
                  </div>
                </div>
                <div className="win98-window p-2 mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold">Dropbox</h4>
                      <p className="text-xs">Sync notes with Dropbox</p>
                    </div>
                    <Win98Button size="sm">Connect</Win98Button>
                  </div>
                </div>
                <div className="win98-window p-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold">GitHub</h4>
                      <p className="text-xs">Sync notes as Markdown files</p>
                    </div>
                    <Win98Button size="sm">Connect</Win98Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shortcuts" className="h-full">
                <h3 className="font-bold mb-3">Keyboard Shortcuts</h3>
                <div className="win98-inset p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Create new note</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">Ctrl+N</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Save note</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">Ctrl+S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Edit/Preview toggle</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">Ctrl+E</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Search</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">Ctrl+F</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Bold text</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">Ctrl+B</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Italic text</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">Ctrl+I</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Insert link</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">Ctrl+K</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Create Wiki link</span>
                    <kbd className="px-2 py-0.5 win98-window text-xs">[[text]]</kbd>
                  </div>
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

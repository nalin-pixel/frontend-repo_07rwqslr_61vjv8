import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import SearchBar from './components/SearchBar'
import EmailList from './components/EmailList'
import EmailDetail from './components/EmailDetail'
import ComposeModal from './components/ComposeModal'
import Hero from './components/Hero'
import SettingsPage from './components/SettingsPage'
import { api } from './api/client'
import { Plus, Settings } from 'lucide-react'

function App() {
  const [selectedAccount, setSelectedAccount] = useState("")
  const [selectedFolder, setSelectedFolder] = useState("All")
  const [selectedLabel, setSelectedLabel] = useState("All")
  const [q, setQ] = useState("")
  const [selectedEmailId, setSelectedEmailId] = useState("")
  const [showCompose, setShowCompose] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [folders, setFolders] = useState([])

  useEffect(() => {
    api.getAccounts().then(setAccounts)
    api.getFolders().then((f) => setFolders(["All", ...f]))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <Hero />
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-[18rem_1fr] max-w-7xl w-full mx-auto rounded-xl overflow-hidden shadow-sm mt-4">
        <Sidebar selectedAccount={selectedAccount} onSelectAccount={setSelectedAccount} selectedFolder={selectedFolder} onSelectFolder={setSelectedFolder} />
        <div className="flex flex-col min-h-[70vh] bg-white">
          <div className="flex items-center justify-between border-b">
            <SearchBar account={selectedAccount} setAccount={setSelectedAccount} folder={selectedFolder} setFolder={setSelectedFolder} label={selectedLabel} setLabel={setSelectedLabel} q={q} setQ={setQ} accounts={accounts} folders={folders} />
            <div className="px-3 flex gap-2">
              <button onClick={()=>setShowCompose(true)} className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"><Plus className="w-4 h-4"/>Compose</button>
              <button onClick={()=>setShowSettings((s)=>!s)} className="px-3 py-2 border rounded-md flex items-center gap-2"><Settings className="w-4 h-4"/>Settings</button>
            </div>
          </div>
          {!showSettings ? (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
              <EmailList account={selectedAccount} folder={selectedFolder} label={selectedLabel} q={q} onSelectEmail={setSelectedEmailId} selectedId={selectedEmailId} />
              <EmailDetail emailId={selectedEmailId} />
            </div>
          ) : (
            <SettingsPage />
          )}
        </div>
      </div>
      <ComposeModal open={showCompose} onClose={()=>setShowCompose(false)} defaultFrom={accounts[0]?.address} />
    </div>
  )
}

export default App

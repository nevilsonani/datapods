import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';

const Vault = () => {
  const { id } = useParams();
  const { account } = useWallet();
  const navigate = useNavigate();
  const [vault, setVault] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files');
  const [showAddFile, setShowAddFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [accessList, setAccessList] = useState([]);
  const [newAccess, setNewAccess] = useState({
    walletAddress: '',
    permission: 'read',
  });

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchVault = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/v1/vaults/${id}`);
        // const data = await response.json();
        // setVault(data.data);
        
        // Mock data
        setTimeout(() => {
          setVault({
            _id: id,
            name: 'Personal Documents',
            description: 'Important personal documents',
            ipfsHash: 'QmXx...',
            owner: account,
            createdAt: new Date(),
            isEncrypted: true,
          });
          
          // Mock access list
          setAccessList([
            {
              _id: '1',
              user: '0x1234...5678',
              permission: 'read',
              grantedAt: new Date(),
            },
            {
              _id: '2',
              user: '0x5678...9012',
              permission: 'write',
              grantedAt: new Date(),
            },
          ]);
          
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching vault:', error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchVault();
    }
  }, [id, account]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      // TODO: Upload file to IPFS and update vault
      // const formData = new FormData();
      // formData.append('file', selectedFile);
      // const response = await fetch(`/api/v1/vaults/${id}/files`, {
      //   method: 'POST',
      //   body: formData,
      // });
      // const data = await response.json();
      
      // Reset form
      setSelectedFile(null);
      setShowAddFile(false);
      
      // Show success message
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file');
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    
    try {
      // TODO: Grant access to wallet
      // const response = await fetch(`/api/v1/vaults/${id}/access`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newAccess),
      // });
      // const data = await response.json();
      
      // Update access list
      setAccessList([
        ...accessList,
        {
          _id: Date.now().toString(),
          user: newAccess.walletAddress,
          permission: newAccess.permission,
          grantedAt: new Date(),
        },
      ]);
      
      // Reset form
      setNewAccess({
        walletAddress: '',
        permission: 'read',
      });
      
      // Show success message
      alert('Access granted successfully!');
    } catch (error) {
      console.error('Error granting access:', error);
      alert('Failed to grant access');
    }
  };

  const handleRevokeAccess = async (accessId) => {
    if (window.confirm('Are you sure you want to revoke this access?')) {
      try {
        // TODO: Revoke access
        // await fetch(`/api/v1/vaults/${id}/access/${accessId}`, {
        //   method: 'DELETE',
        // });
        
        // Update access list
        setAccessList(accessList.filter(access => access._id !== accessId));
        
        // Show success message
        alert('Access revoked successfully!');
      } catch (error) {
        console.error('Error revoking access:', error);
        alert('Failed to revoke access');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!vault) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Vault not found</h3>
        <p className="mt-2 text-sm text-gray-500">
          The vault you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Vault header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {vault.name}
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className="text-gray-500">{vault.description || 'No description'}</span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg
                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Created on {new Date(vault.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  {vault.ipfsHash}
                </span>
                {vault.isEncrypted && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg
                      className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400"
                      fill="currentColor"
                      viewBox="0 0 8 8"
                    >
                      <circle cx={4} cy={4} r={3} />
                    </svg>
                    Encrypted
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              type="button"
              onClick={() => setShowAddFile(!showAddFile)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showAddFile ? 'Cancel' : 'Add File'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'files' ? 'access' : 'files')}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {activeTab === 'files' ? 'Manage Access' : 'View Files'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('files')}
              className={`${activeTab === 'files' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Files
            </button>
            <button
              onClick={() => setActiveTab('access')}
              className={`${activeTab === 'access' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Access Control
            </button>
          </nav>
        </div>

        {/* Add File Form */}
        {showAddFile && (
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Add File to Vault
              </h3>
              <form onSubmit={handleUpload} className="mt-5">
                <div>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {selectedFile
                          ? `Selected: ${selectedFile.name}`
                          : 'PNG, JPG, PDF up to 10MB'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddFile(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedFile}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${selectedFile ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="mt-6">
            {vault.files && vault.files.length > 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {vault.files.map((file) => (
                    <li key={file._id}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="truncate">
                            <div className="flex text-sm">
                              <p className="font-medium text-indigo-600 truncate">
                                {file.name}
                              </p>
                              <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                                in {vault.name}
                              </p>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <p>{file.size}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <button
                            onClick={() => {
                              // Handle download
                              window.open(`/api/v1/vaults/${vault._id}/files/${file._id}`, '_blank');
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-gray-300 border-dashed rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by uploading a file.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowAddFile(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    New File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Access Control Tab */}
        {activeTab === 'access' && (
          <div className="mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Access Control
                </h3>
                <button
                  onClick={() => {
                    setNewAccess({ walletAddress: '', permission: 'read' });
                    document.getElementById('grant-access-modal').classList.remove('hidden');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Grant Access
                </button>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {vault.owner === account ? 'You (Owner)' : 'Owner'}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Full Access
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {vault.owner}
                        </p>
                      </div>
                    </div>
                  </li>
                  {accessList.map((access) => (
                    <li key={access._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {access.user === account ? 'You' : access.user}
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {access.permission === 'read' ? 'Read Only' : 'Read/Write'}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Granted on {new Date(access.grantedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {vault.owner === account && (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <button
                              onClick={() => handleRevokeAccess(access._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Revoke
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grant Access Modal */}
      <div id="grant-access-modal" className="hidden fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => document.getElementById('grant-access-modal').classList.add('hidden')}></div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Grant Access
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Enter the wallet address you want to grant access to this vault.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <form onSubmit={handleGrantAccess}>
                <div>
                  <label htmlFor="wallet-address" className="block text-sm font-medium text-gray-700">
                    Wallet Address
                  </label>
                  <input
                    type="text"
                    name="wallet-address"
                    id="wallet-address"
                    required
                    value={newAccess.walletAddress}
                    onChange={(e) => setNewAccess({ ...newAccess, walletAddress: e.target.value })}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="0x..."
                  />
                </div>
                <div className="mt-4">
                  <label htmlFor="permission" className="block text-sm font-medium text-gray-700">
                    Permission Level
                  </label>
                  <select
                    id="permission"
                    name="permission"
                    value={newAccess.permission}
                    onChange={(e) => setNewAccess({ ...newAccess, permission: e.target.value })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="read">Read Only</option>
                    <option value="write">Read & Write</option>
                  </select>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  >
                    Grant Access
                  </button>
                  <button
                    type="button"
                    onClick={() => document.getElementById('grant-access-modal').classList.add('hidden')}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault; 

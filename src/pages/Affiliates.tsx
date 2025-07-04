import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaUsers, FaUserFriends, FaSitemap, FaArrowUp, FaArrowDown, FaCopy, FaCheckCircle, FaEnvelopeOpenText } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Affiliates = () => {
  const { user, user_base_data } = useAuth();
  const referralSummary = user_base_data?.referrals;
  const totalEarnFromAffiliation = referralSummary?.total_earn_from_affiliation || 0;
  const eachLevelIncome = referralSummary?.each_level_income || [];
  const eachLevelAffiliaterNumber = referralSummary?.each_level_affiliater_number || [];
  const referralNetwork = referralSummary?.network || [];
  const uplineUsers = user_base_data?.upline_users || [];
  const [copied, setCopied] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteError, setInviteError] = React.useState('');
  const [inviteSuccess, setInviteSuccess] = React.useState(false);
  const referralLink = `${window.location.origin}/register?ref=${user?.referral_code}`;
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // ignore
    }
  };
  const handleInvite = () => {
    setInviteError('');
    setInviteSuccess(false);
    const email = inviteEmail.trim();
    if (!email) {
      setInviteError('Please enter an email address.');
      return;
    }
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setInviteError('Please enter a valid email address.');
      return;
    }
    const subject = encodeURIComponent('Join me on GreenDash!');
    const body = encodeURIComponent(
      `Hi there,%0D%0A%0D%0AI'd like to invite you to join GreenDash, a platform for sustainable investing and rewards. Use my referral link to sign up and start earning together!%0D%0A%0D%0AReferral Link: ${referralLink}%0D%0A%0D%0ASee you inside!`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setInviteSuccess(true);
    setInviteEmail('');
    setTimeout(() => setInviteSuccess(false), 3000);
  };

  // Recursive tree rendering for referral network
  const renderReferralTree = (network, level = 1) => (
    <ul className={`pl-${level * 4} border-l-2 border-gray-200 ml-2`}>
      {network.map(node => (
        <li key={node.id} className="mb-2">
          <div className={`flex items-center gap-2 py-1 px-2 rounded ${level === 1 ? 'bg-blue-50' : 'bg-green-50'}`}>
            <FaUserFriends className="text-blue-500" />
            <span className="font-semibold">{node.referred_user.name}</span>
            <span className="text-xs text-gray-500">(Level {node.level})</span>
            <span className="ml-2 text-green-600">{node.commission_income} EGD</span>
          </div>
          {node.sub_referrals && node.sub_referrals.length > 0 && (
            renderReferralTree(node.sub_referrals, level + 1)
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Program</h1>
          <p className="text-gray-600 mt-2">
            Build your network and earn rewards.
          </p>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="levels">Levels</TabsTrigger>
              <TabsTrigger value="network">Network Tree</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Referral Earnings</CardTitle>
                    <CardDescription>Total earned from your network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">{totalEarnFromAffiliation} EGD</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Referral Code</CardTitle>
                    <CardDescription>Your unique code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold font-mono mb-4">{user?.referral_code}</div>
                    <div className="flex gap-2 items-center">
                      <Input value={referralLink} readOnly className="flex-1" />
                      <Button onClick={copyReferralLink} variant="outline">
                        {copied ? (
                          <>
                            <FaCheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy className="mr-2 h-4 w-4" />
                            Copy Link
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2 items-center mt-4">
                      <Input
                        placeholder='Input Email address to send your referral link'
                        className="placeholder:text-[12px] flex-1"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        type="email"
                        autoComplete="off"
                        aria-label="Invite Email"
                      />
                      <Button onClick={handleInvite} variant="outline" className='flex-1 min-w-[100px]'>
                        <FaEnvelopeOpenText className="mr-2 h-4 w-4" />
                        Invite
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Enter an email address and click Invite to send your referral link via email.
                    </div>
                    {inviteError && <div className="text-xs text-red-600 mt-1">{inviteError}</div>}
                    {inviteSuccess && <div className="text-xs text-green-600 mt-1">Invitation email window opened!</div>}
                  </CardContent>
                </Card>
              </div>
              {uplineUsers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Upline Users</CardTitle>
                    <CardDescription>See your sponsor lineage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {uplineUsers.map((upline) => (
                        <div key={upline.user.id} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex flex-col items-center min-w-[120px]">
                          <span className="text-xs font-bold text-gray-500 mb-1">Level {upline.level}</span>
                          <span className="font-semibold">{upline.user.name}</span>
                          <span className="text-xs text-gray-400">{upline.user.email}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Levels Tab */}
            <TabsContent value="levels" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Each Level Income</CardTitle>
                  <CardDescription>Income by referral level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mt-2 w-full justify-between">
                    {eachLevelIncome.map((income, idx) => (
                      <div key={idx} className="bg-white shadow rounded-lg px-4 py-2 flex-1 flex flex-col items-center min-w-[120px] border border-gray-200">
                        <span className="text-xs font-bold text-gray-500 mb-1">Level {idx + 1}</span>
                        <span className="text-lg font-bold text-green-600">{income} EGD</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Each Level Affiliater Number</CardTitle>
                  <CardDescription>Number of affiliates by level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3 mt-2 w-full justify-between">
                    {eachLevelAffiliaterNumber.map((num, idx) => (
                      <div key={idx} className="bg-white shadow rounded-lg px-4 py-2 flex-1 flex flex-col items-center min-w-[120px] border border-gray-200">
                        <span className="text-xs font-bold text-gray-500 mb-1">Level {idx + 1}</span>
                        <span className="text-lg font-bold text-blue-600">{num}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Network Tree Tab */}
            <TabsContent value="network" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Referral Network Tree</CardTitle>
                  <CardDescription>Visualize your direct and indirect referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  {referralNetwork.length > 0 ? (
                    renderReferralTree(referralNetwork)
                  ) : (
                    <div className="text-center text-gray-400">No referral network yet.</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Affiliates;

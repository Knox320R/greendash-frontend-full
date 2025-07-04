import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { affiliateRelationshipsApi, AffiliateRelationship } from '@/store/affiliateRelationships';
import { usersApi, User } from '@/store/users';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

function buildReferralTree(relationships: AffiliateRelationship[], users: User[]) {
  const userMap = Object.fromEntries(users.map(u => [u.id, { ...u, children: [] as any[] }]));
  relationships.forEach(rel => {
    if (userMap[rel.referrer_id] && userMap[rel.referred_id]) {
      userMap[rel.referrer_id].children.push(userMap[rel.referred_id]);
    }
  });
  // Roots: users who are not referred by anyone
  const referredIds = new Set(relationships.map(r => r.referred_id));
  return Object.values(userMap).filter(u => !referredIds.has(u.id));
}

function ReferralNode({ user }: { user: any }) {
  return (
    <div className="ml-4 mt-2">
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded shadow-sm border border-green-200">
        <Avatar className="w-8 h-8">
          {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : <AvatarFallback>{user.name[0]}</AvatarFallback>}
        </Avatar>
        <div>
          <div className="font-semibold text-green-800">{user.name}</div>
          <div className="text-xs text-gray-500">{user.email}</div>
        </div>
      </div>
      {user.children && user.children.length > 0 && (
        <div className="ml-6 border-l-2 border-green-200 pl-4">
          {user.children.map((child: any) => (
            <ReferralNode key={child.id} user={child} />
          ))}
        </div>
      )}
    </div>
  );
}

const ReferralTree: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const affiliateRelationships = useSelector((state: RootState) => state.affiliateRelationships.list) as AffiliateRelationship[];
  const users = useSelector((state: RootState) => state.users.list) as User[];
  const affiliateLoading = useSelector((state: RootState) => state.affiliateRelationships.isLoading);

  useEffect(() => {
    dispatch(affiliateRelationshipsApi.get());
    if (users.length === 0) dispatch(usersApi.get());
  }, [dispatch, users.length]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 text-lg font-semibold text-green-700">Referral Network Tree</div>
      {affiliateLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      ) : affiliateRelationships.length === 0 || users.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No referral data available.</div>
      ) : (
        buildReferralTree(affiliateRelationships, users).map((rootUser: any) => (
          <ReferralNode key={rootUser.id} user={rootUser} />
        ))
      )}
    </div>
  );
};

export default ReferralTree; 
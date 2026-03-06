import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);

  const InfoField = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col bg-gray-50 rounded-xl p-4 border border-gray-200">
      <span className="flex items-center text-gray-500 text-sm mb-1">
        {Icon && <Icon className="w-4 h-4 mr-2 text-[#D6482B]" />}
        {label}
      </span>
      <span className="font-medium text-gray-800 break-words">
        {value || "—"}
      </span>
    </div>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-24 lg:pl-[320px]">
      {loading ? (
        <Spinner />
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* PROFILE HEADER */}

          <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row items-center gap-6">
            <img
              src={user?.profileImage?.url}
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#D6482B]/20 shadow-md"
            />

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">
                {user?.userName}
              </h2>

              <p className="text-gray-500">{user?.email}</p>

              <span className="inline-block mt-2 px-4 py-1 text-sm rounded-full bg-[#D6482B]/10 text-[#D6482B] font-semibold">
                {user?.role}
              </span>
            </div>
          </div>

          {/* PERSONAL DETAILS */}

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Personal Details
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InfoField
                icon={UserIcon}
                label="Username"
                value={user?.userName}
              />

              <InfoField
                icon={EnvelopeIcon}
                label="Email"
                value={user?.email}
              />

              <InfoField icon={PhoneIcon} label="Phone" value={user?.phone} />

              <InfoField
                icon={MapPinIcon}
                label="Address"
                value={user?.address}
              />

              <InfoField
                icon={CalendarDaysIcon}
                label="Joined On"
                value={user?.createdAt?.substring(0, 10)}
              />
            </div>
          </div>

          {/* PAYMENT DETAILS */}

          {user?.role === "Auctioneer" && (
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Payment Details
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoField
                  icon={BanknotesIcon}
                  label="Bank Name"
                  value={user?.paymentMethods?.bankTransfer?.bankName}
                />

                <InfoField
                  icon={CreditCardIcon}
                  label="Bank Account"
                  value={user?.paymentMethods?.bankTransfer?.bankAccountNumber}
                />

                <InfoField
                  icon={UserIcon}
                  label="Account Holder Name"
                  value={user?.paymentMethods?.bankTransfer?.bankAccountName}
                />

                <InfoField
                  label="Easypaisa Number"
                  value={
                    user?.paymentMethods?.easypaisa?.easypaisaAccountNumber
                  }
                />

                <InfoField
                  label="Paypal Email"
                  value={user?.paymentMethods?.paypal?.paypalEmail}
                />
              </div>
            </div>
          )}

          {/* STATS */}

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Account Statistics
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {user?.role === "Auctioneer" && (
                <InfoField
                  label="Unpaid Commission"
                  value={`₹ ${user?.unpaidCommission}`}
                />
              )}

              {user?.role === "Bidder" && (
                <>
                  <InfoField label="Auctions Won" value={user?.auctionsWon} />

                  <InfoField
                    label="Money Spent"
                    value={`₹ ${user?.moneySpent}`}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UserProfile;

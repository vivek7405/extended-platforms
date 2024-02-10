"use client";

import BlurImage from "@/components/ui/blur-image";
import LoadingDots from "@/components/icons/loading-dots";
import Modal from "@/components/modal";
import { SiteInvite } from "@prisma/client";
import va from "@vercel/analytics";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { acceptInvite } from "../actions/accept-invite";

export function AcceptInviteModal({
  invite,
}: {
  invite: SiteInvite & { site: { name: string | null } };
}) {
  const router = useRouter();
  const [accepting, setAccepting] = useState(false);
  const [showAcceptInviteModal, setShowAcceptInviteModal] = useState(true);

  return (
    <Modal
      showModal={showAcceptInviteModal}
      setShowModal={setShowAcceptInviteModal}
    >
      {invite.expires >= new Date() ? (
        <div className="inline-block w-full transform overflow-hidden bg-white align-middle shadow-xl transition-all sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
            <BlurImage
              src={`/logo.png`}
              alt={"Invite Teammate"}
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
            <h3 className="text-lg font-medium">Project Invitation</h3>
            <p className="text-center text-sm text-gray-500">
              You've been invited to join and collaborate on the{" "}
              <span className="font-mono text-purple-600">
                {invite?.site?.name || "......"}
              </span>{" "}
              site on Platforms
            </p>
          </div>
          <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
            <button
              onClick={async () => {
                setAccepting(true);

                const res = await acceptInvite(invite.siteId);
                if (!res?.error) {
                  mutate("teammates");
                  mutate("invites");
                  toast.success("You now are a part of this site!");
                  va.track("User accepted site invite", {
                    site: invite?.site?.name,
                  });
                } else {
                  toast.error(res.error);
                }

                setAccepting(false);
                setShowAcceptInviteModal(false);
                // revalidatePath("/sites");
                router.refresh();
              }}
              disabled={accepting}
              className={`${
                accepting
                  ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                  : "border-black bg-black text-white hover:bg-white hover:text-black"
              } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
              {accepting ? (
                <LoadingDots color="#808080" />
              ) : (
                <p>Accept invite</p>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="inline-block w-full transform overflow-hidden bg-white align-middle shadow-xl transition-all sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
            <BlurImage
              src={`/logo.png`}
              alt={"Invite Teammate"}
              className="h-10 w-10 rounded-full"
              width={20}
              height={20}
            />
            <h3 className="text-lg font-medium">Project Invitation Expired</h3>
            <p className="text-center text-sm text-gray-500">
              This invite has expired or is no longer valid.
            </p>
          </div>
          <div className="flex flex-col space-y-6 bg-gray-50 px-4 py-8 text-left sm:px-16">
            <Link
              href="/"
              className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-black text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}

// export function useAcceptInviteModal() {
//   const [showAcceptInviteModal, setShowAcceptInviteModal] = useState(false);

//   const AcceptInviteModalCallback = useCallback(() => {
//     return (
//       <AcceptInviteModal
//         showAcceptInviteModal={showAcceptInviteModal}
//         setShowAcceptInviteModal={setShowAcceptInviteModal}
//       />
//     );
//   }, [showAcceptInviteModal, setShowAcceptInviteModal]);

//   return useMemo(
//     () => ({
//       setShowAcceptInviteModal,
//       AcceptInviteModal: AcceptInviteModalCallback,
//     }),
//     [setShowAcceptInviteModal, AcceptInviteModalCallback],
//   );
// }

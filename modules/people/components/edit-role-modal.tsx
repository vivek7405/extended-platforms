// import useProject from "@/lib/swr/use-project";
// import { UserProps } from "@/lib/types";
// import { BlurImage } from "@/ui/shared/blur-image";
// import { Avatar, Button, Logo, Modal } from "@dub/ui";
import { useParams, useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { UserProps } from "../types";
import Modal from "@/components/modal";
import BlurImage from "@/components/ui/blur-image";
import { getSite } from "@/modules/sites/fetchers";
import LoadingDots from "@/components/icons/loading-dots";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { setRole } from "../actions/set-role";
import { Site } from "@prisma/client";

function EditRoleModal({
  showEditRoleModal,
  setShowEditRoleModal,
  user,
  role,
}: {
  showEditRoleModal: boolean;
  setShowEditRoleModal: Dispatch<SetStateAction<boolean>>;
  user: UserProps;
  role: "owner" | "member";
}) {
  const { id: siteId } = useParams() as { id: string };
  const [editing, setEditing] = useState(false);
  const { data, isLoading } = useSWR("site", () => getSite(siteId, null, null));
  const site = data as Site;
  //   const { name: siteName, logo } = site;
  const { id: userId, name, email, image } = user;
  const router = useRouter();

  //   return !isLoading ? (
  //     <Modal showModal={showEditRoleModal} setShowModal={setShowEditRoleModal}>
  //       <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
  //         {site?.logo ? (
  //           <BlurImage
  //             src={site?.logo}
  //             alt="Project logo"
  //             className="h-10 w-10 rounded-full"
  //             width={20}
  //             height={20}
  //           />
  //         ) : (
  //           <BlurImage
  //             src="/logo.png"
  //             alt="Project logo"
  //             className="h-10 w-10 rounded-full"
  //             width={20}
  //             height={20}
  //           />
  //         )}
  //         <h3 className="text-lg font-medium">Change Teammate Role</h3>
  //         <p className="text-center text-sm text-gray-500">
  //           This will change <b className="text-gray-800">{name || email}</b>'s
  //           role in <b className="text-gray-800">{site?.name || ""}</b> to{" "}
  //           <b className="text-gray-800">{role}</b>. Are you sure you want to
  //           continue?
  //         </p>
  //       </div>

  //       <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16">
  //         <div className="flex items-center space-x-3 rounded-md border border-gray-300 bg-white p-3">
  //           <Avatar user={user} />
  //           <div className="flex flex-col">
  //             <h3 className="text-sm font-medium">{name || email}</h3>
  //             <p className="text-xs text-gray-500">{email}</p>
  //           </div>
  //         </div>
  //         <Button
  //           text="Confirm"
  //           loading={editing}
  //           onClick={async () => {
  //             setEditing(true);
  //             await setRole(userId, siteId, role);

  //             // fetch(`/api/projects/${slug}/users`, {
  //             //   method: "PUT",
  //             //   headers: { "Content-Type": "application/json" },
  //             //   body: JSON.stringify({
  //             //     userId: id,
  //             //     role,
  //             //   }),
  //             // }).then(async (res) => {
  //             //   if (res.status === 200) {
  //             //     await mutate(`/api/projects/${slug}/users`);
  //             //     setShowEditRoleModal(false);
  //             //     toast.success(
  //             //       `Successfully changed ${name || email}'s role to ${role}.`,
  //             //     );
  //             //   } else {
  //             //     const error = await res.text();
  //             //     toast.error(error);
  //             //   }
  //             //   setEditing(false);
  //             // });
  //           }}
  //         />
  //       </div>
  //     </Modal>
  //   ) : (
  //     <LoadingDots />
  //   );

  return !isLoading ? (
    <Modal showModal={showEditRoleModal} setShowModal={setShowEditRoleModal}>
      <div className="inline-block w-full transform overflow-hidden bg-white align-middle shadow-xl transition-all sm:max-w-md sm:rounded-2xl sm:border sm:border-gray-200">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 px-4 py-4 pt-8 sm:px-16">
          <BlurImage
            src={site?.logo || "/logo.png"}
            alt="Remove Teammate"
            className="h-10 w-10 rounded-full"
            width={20}
            height={20}
          />
          <h3 className="text-lg font-medium">Change Teammate Role</h3>
          <p className="text-center text-sm text-gray-500">
            This will change <b className="text-gray-800">{name || email}</b>'s
            role in <b className="text-gray-800">{site?.name || ""}</b> to{" "}
            <b className="text-gray-800">{role}</b>. Are you sure you want to
            continue?
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 text-left sm:px-16">
          <div className="flex items-center space-x-3 rounded-md border border-gray-300 bg-white p-3">
            <Avatar user={user} />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{name || email}</h3>
              <p className="text-xs text-gray-500">{email}</p>
            </div>
          </div>
          <Button
            text="Confirm"
            loading={editing}
            onClick={async () => {
              setEditing(true);
              const res = await setRole(userId, siteId, role);

              if (!(res as any)?.error) {
                // await mutate(`/api/projects/${siteId}/users`);
                await mutate("teammates");
                setShowEditRoleModal(false);
                toast.success(
                  `Successfully changed ${name || email}'s role to ${role}.`,
                );
              } else {
                toast.error((res as any)?.error);
              }

              setEditing(false);
              // router.refresh();

              // fetch(`/api/projects/${slug}/users`, {
              //   method: "PUT",
              //   headers: { "Content-Type": "application/json" },
              //   body: JSON.stringify({
              //     userId: id,
              //     role,
              //   }),
              // }).then(async (res) => {
              //   if (res.status === 200) {
              //     await mutate(`/api/projects/${slug}/users`);
              //     setShowEditRoleModal(false);
              //     toast.success(
              //       `Successfully changed ${name || email}'s role to ${role}.`,
              //     );
              //   } else {
              //     const error = await res.text();
              //     toast.error(error);
              //   }
              //   setEditing(false);
              // });
            }}
          />
        </div>
      </div>
    </Modal>
  ) : (
    <LoadingDots color="black" />
  );
}

export function useEditRoleModal({
  user,
  role,
}: {
  user: UserProps;
  role: "owner" | "member";
}) {
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);

  const EditRoleModalCallback = useCallback(() => {
    return (
      <EditRoleModal
        showEditRoleModal={showEditRoleModal}
        setShowEditRoleModal={setShowEditRoleModal}
        user={user}
        role={role}
      />
    );
  }, [showEditRoleModal, setShowEditRoleModal]);

  return useMemo(
    () => ({
      setShowEditRoleModal,
      EditRoleModal: EditRoleModalCallback,
    }),
    [setShowEditRoleModal, EditRoleModalCallback],
  );
}

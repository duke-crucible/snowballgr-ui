import emitter from "./EventEmitter";
import { invitePeer } from "../service/apiService";

export const onKeyEnter = (evt) => {
  if (evt.key === "Enter") {
    evt.target.blur();
  }
};

/**
 * Wrap of invite
 */
export const sendInvite = (record) => {
  invitePeer(record).then(() => {
    emitter.emit("refresh-table");
  });
};

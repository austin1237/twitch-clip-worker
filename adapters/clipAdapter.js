let transformClip = clip => {
  let newClip = {};
  newClip.url = clip.url;
  newClip.streamer = clip.broadcaster.name;
  newClip.createdAt = clip.created_at;
  console.log("new clip is", newClip);
  return newClip;
};

exports.transformClip = transformClip;

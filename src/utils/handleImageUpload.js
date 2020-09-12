async function handleImageUpload(image) {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "instagram");
  data.append("cloud_name", "dpifeeqlv");
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dpifeeqlv/image/upload",
    {
      method: "POST",
      accept: "application/json",
      body: data,
    }
  );
  const jsonRes = await res.json();
  return jsonRes.url;
}

export default handleImageUpload;

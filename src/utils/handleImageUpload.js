async function handleImageUpload(image, uploadPreset = "instagram") {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", uploadPreset);
  data.append("cloud_name", "dpifeeqlv");
  const res = await fetch("https://api.cloudinary.com/v1_1/dpifeeqlv/image/upload", {
    method: "POST",
    accept: "application/json",
    body: data,
  });
  const jsonRes = await res.json();
  console.log(jsonRes);
  return jsonRes.secure_url;
}

export default handleImageUpload;

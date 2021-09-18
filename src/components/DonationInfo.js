
function DonationInfo({ image, label, data  }) {
  return <div className="tag d-flex justify-content-start">
    <div className="icon-donation mr-2">
      <img src={image} height="20"/>
    </div>
    <div className="content">
      <h5 className="fs-12 font-bold text">{label}</h5>
      <h3 className="fs-18 font-bold">{data}</h3>
    </div>
  </div>;
};

export default DonationInfo;
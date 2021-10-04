function DonationInfo({ icon, label, data  }) {
  return <div className="donation-info">
    <div className="donation-img">
      {icon}
    </div>
    <div className="donation-text">
      <span>{label}</span>
      <h4>{data}</h4>
    </div>
  </div>;
};

export default DonationInfo;
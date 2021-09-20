function DonationUpdate({ icon, iconalt, date, message, linkText, linkHref }) {
  return <div className="update-card">
    <div className="update-icon">
        <img src={icon} alt={iconalt}/>
    </div>
    <div className="update-content">
      <span>{date}</span>
      <p>{message}</p>
      <a href={linkHref} target="_blank">{linkText}</a>
    </div>
    <div className="close">
      <i className="fal fa-times"></i>
    </div>
  </div>;
};

export default DonationUpdate;
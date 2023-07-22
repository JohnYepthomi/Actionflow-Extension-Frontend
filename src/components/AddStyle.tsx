const AddStyle = ({children, style}) => {
  return (
    <>
      <style type="text/css">{style}</style>
      {children}
    </>
  );
}

export default AddStyle;
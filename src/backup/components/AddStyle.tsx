type AddStyleParams = { children: any; style: any };

const AddStyle = ({ children, style }: AddStyleParams) => {
  return (
    <>
      <style type="text/css">{style}</style>
      {children}
    </>
  );
};

export default AddStyle;

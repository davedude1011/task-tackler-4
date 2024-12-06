import { Copy, FileInputIcon } from "lucide-react";

interface FileInputProps {
  image: string | null;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}

const FileInput: React.FC<FileInputProps> = ({ image, setImage }) => {
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const file = e.clipboardData.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-md border ${
        image ? "" : "border-dashed p-12"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onPaste={handlePaste}
      onClick={() => document.getElementById("fileInput")?.click()}
    >
      {image ? (
        <img
          src={image}
          alt="Preview"
          className="max-h-96 max-w-lg rounded-md"
        />
      ) : (
        <>
          <FileInputIcon size={48} className="opacity-25" />
          <div className="font-thin">
            Paste your image here or click to upload
          </div>
        </>
      )}
      {/* Hidden file input */}
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default FileInput;

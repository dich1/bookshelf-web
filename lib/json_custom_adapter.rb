class JsonCustomAdapter < ActiveModelSerializers::Adapter::Json
  def serializable_hash options = nil
    serialized_hash = super

    if serialized_hash[meta_key]
      meta = serialized_hash.delete meta_key
      serialized_hash.merge! meta
    end

    serialized_hash
  end
end
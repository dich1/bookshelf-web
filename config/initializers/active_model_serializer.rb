require "json_custom_adapter"
ActiveModelSerializers::Adapter.register(:json_custom, JsonCustomAdapter)
ActiveModelSerializers.config.adapter = :json_custom
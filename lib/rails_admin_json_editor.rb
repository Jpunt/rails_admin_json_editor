require "rails_admin_json_editor/version"

module RailsAdminJsonEditor
  class Engine < Rails::Engine
  end
end

require 'rails_admin/config/fields/types/text'

module RailsAdmin
  module Config
    module Fields
      module Types
        class JsonEditor < RailsAdmin::Config::Fields::Types::Text
          # Register field type for the type loader
          RailsAdmin::Config::Fields::Types.register(self)

          register_instance_option :render do
            bindings[:view].render partial: "rails_admin_json_editor/main/form_json_editor", locals: {field: self, form: bindings[:form]}
          end

          register_instance_option :models do
            @models
          end

          def schema
            @models = []
            yield if block_given?
          end

          def model(m)
            model = Model.new(m)

            yield(model) if block_given?

            @models << model
          end

          class Model
            attr_accessor :name, :fields
            attr_accessor :label, :help

            def initialize(model)
              @name = model.name.gsub("::","___")
              @fields = []
              @label = model.name.demodulize.humanize
            end

            def field(name, type, options = {})
              field = Field.new(name, type, options)

              yield(field) if block_given?

              @fields << field
            end

            def label(s = nil)
              if s.nil? then return @label else @label = s end
            end

            def help(s = nil)
              if s.nil? then return @help else @help = s end
            end
          end

          class Field
            attr_accessor :name, :type
            attr_accessor :label, :help
            attr_accessor :picker_label
            attr_accessor :picker_records
            attr_accessor :allowed_nested_models

            def initialize(name, type, options = {})
              @name = name
              @type = type
              @label = name.to_s.humanize

              if type == :list
                allowed = options[:models].nil? ? [options[:model]] : options[:models]

                if allowed.nil?
                  raise "At least one model should be set for JsonEditor::Field with type => :list"
                end

                @allowed_nested_models = allowed.map { |m| m.name.gsub("::","___") }
              end
            end

            def label(s = nil)
              if s.nil? then return @label else @label = s end
            end

            def help(s = nil)
              if s.nil? then return @help else @help = s end
            end

            def setup_picker(label, records)
              @picker_label = label
              @picker_records = records
            end
          end
        end
      end
    end
  end
end

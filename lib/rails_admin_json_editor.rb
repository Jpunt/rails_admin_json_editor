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

          register_instance_option :components do
            @components
          end

          def setup
            @components = []
            yield if block_given?
          end

          def component(type)
            component = Component.new(type)

            yield(component) if block_given?

            @components << component
          end

          class Component
            attr_accessor :type, :fields
            attr_accessor :label, :help

            def initialize(type)
              @type = type
              @fields = []
              @label = type.to_s.humanize
            end

            def field(name, type)
              field = Field.new(name, type)

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
            attr_accessor :components

            def initialize(name, type)
              @name = name
              @type = type
              @label = name.to_s.humanize
              @components = [] if type == :list
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

            def component(type)
              component = Component.new(type)

              yield(component) if block_given?

              @components << component
            end
          end
        end
      end
    end
  end
end

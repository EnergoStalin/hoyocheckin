local overseer = require('overseer')

local clasp = {
  name = 'clasp',
  hide = true,
  params = {
    args = {
      name = 'args',
      type = 'list',
    },
  },
  builder = function(p)
    return {
      name = string.format('clasp %s', table.concat(p.args, ' ')),
      cmd = 'clasp',
      args = p.args,
      components = {
        'default',
        'unique',
      },
    }
  end,
}

local function extend_base_components(base, components)
  return function(p)
    local task = base.builder(p)
    for i = 1, #components do
      task.components[#task.components + i] = components[i]
    end
    return task
  end
end

overseer.register_template(clasp)
overseer.register_template(
  overseer.wrap_template(clasp, {
    name = 'clasp push',
    hide = false,
    builder = extend_base_components(clasp, {
      'restart_on_save',
      { 'on_complete_dispose', require_view = { 'FAILURE', }, timeout = 10, },
    }),
  }, { args = { 'push', '-f', }, })
)

overseer.register_template(
  overseer.wrap_template(clasp, {
    name = 'clasp open',
    hide = false,
    builder = extend_base_components(clasp, {
      { 'on_complete_dispose', timeout = 10, },
    }),
  }, { args = { 'open', }, })
)

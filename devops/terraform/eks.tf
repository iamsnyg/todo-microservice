# ==========================================
# EKS Cluster
# ==========================================

resource "aws_eks_cluster" "todo" {
  name     = "${var.project_name}-eks"
  role_arn = aws_iam_role.eks_cluster.arn

  version = var.eks_version

  vpc_config {
    subnet_ids = aws_subnet.private[*].id

    security_group_ids = [
      aws_security_group.eks.id
    ]

    endpoint_private_access = true
    endpoint_public_access  = true
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]

  tags = {
    Name    = "${var.project_name}-eks"
    Project = var.project_name
  }
}


# ==========================================
# EKS Managed Node Group
# ==========================================

resource "aws_eks_node_group" "todo" {
  cluster_name = aws_eks_cluster.todo.name

  node_group_name = "${var.project_name}-nodes"

  node_role_arn = aws_iam_role.eks_node.arn

  subnet_ids = aws_subnet.private[*].id

  instance_types = [
    var.eks_node_instance_type
  ]

  capacity_type = "ON_DEMAND"

  scaling_config {
    desired_size = var.eks_desired_nodes
    min_size     = var.eks_min_nodes
    max_size     = var.eks_max_nodes
  }

  update_config {
    max_unavailable = 1
  }

  disk_size = 30

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node,
    aws_iam_role_policy_attachment.eks_cni,
    aws_iam_role_policy_attachment.eks_ecr
  ]

  tags = {
    Name    = "${var.project_name}-eks-node"
    Project = var.project_name
  }
}